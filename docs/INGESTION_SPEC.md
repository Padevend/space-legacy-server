# Ingestion Bundle Specification (INGESTION_SPEC.md)

This document specifies the format, limits, validation pipeline, and error handling for SPACE LEGACY ZIP ingestion bundles (`POST /api/v1/admin/ingestion`).

---

## 1. Overview & Architecture

The ingestion module allows Space Legacy administrators to batch-import celestial exploration machines, factual metadata (sources, facts, events, imagery), and educational quizzes through an offline-prepared, cryptographic-grade validated ZIP archive.

### Ingestion Principles (Normative Constraints)
- **N4 (Module Isolation):** The ingestion module coordinates the transaction across machine and quiz tables without leaky domain coupling.
- **N6 (Boundary Validation):** Every entry within the ZIP is validated at binary, structural, and schema levels before touching the database.
- **N7 (Truthfulness & Provenance):** No machine, fact, or event may exist without an authentic source referencing authorized official domains (`nasa.gov`, `jpl.nasa.gov`).
- **N8 (Integrity & Security):** Malicious ZIPs (Zip Slip, Zip Bomb, disguised executables, oversized images) are rejected atomically with zero writes to disk or database.

---

## 2. Bundle Archive Structure

An ingestion bundle is a standard unencrypted ZIP archive formatted as follows:

```
bundle.zip
├── manifest.json
├── machines/
│   └── <slug>/
│       ├── machine.json
│       └── images/
│           ├── <filename>.jpg
│           ├── <filename>.png
│           └── <filename>.webp
└── quizzes/
    └── <slug>.json
```

### Path & Filename Rules
- Entries must use forward slashes (`/`). Backslashes (`\`) and absolute paths (`/etc/...`, `C:\...`) are forbidden.
- Relative traversal tokens (`..`) are strictly forbidden (`ZIP_PATH_TRAVERSAL`).
- Hidden files and folders (e.g. `__MACOSX/`, `.DS_Store`, `.git/`) are rejected (`ZIP_FORBIDDEN_ENTRY`).
- Maximum path nesting depth is **4 levels** (`ZIP_FORBIDDEN_ENTRY`).
- Filename length must not exceed **120 characters** (`ZIP_FORBIDDEN_ENTRY`).

---

## 3. Quotas and Limits

The following limits are enforced by `config/ingestion.ts`:

| Parameter | Limit | Rejection Code |
| :--- | :--- | :--- |
| **Max Archive Size** | 25 MB (`26,214,400` bytes) | `ZIP_TOO_LARGE` |
| **Max Total Entries** | 300 entries | `ZIP_TOO_MANY_ENTRIES` |
| **Max Uncompressed Single Entry** | 15 MB (`15,728,640` bytes) | `ZIP_BOMB_SUSPECTED` |
| **Max Total Uncompressed Size** | 120 MB (`125,829,120` bytes) | `ZIP_BOMB_SUSPECTED` |
| **Max Compression Ratio** | 50 : 1 | `ZIP_BOMB_SUSPECTED` |
| **Max JSON File Size** | 512 KB (`524,288` bytes) | `SCHEMA_INVALID` |
| **Max Image Dimensions** | 4,000 × 4,000 pixels | `IMAGE_INVALID` |
| **Max Megapixels** | 16 Megapixels | `IMAGE_INVALID` |
| **Allowed File Extensions** | `.json`, `.jpg`, `.jpeg`, `.png`, `.webp` | `FORBIDDEN_EXTENSION` |
| **Allowed Source URL Hosts** | `nasa.gov`, `jpl.nasa.gov` (subdomains included) | `URL_NOT_ALLOWED` |

---

## 4. Manifest & Payload JSON Schemas

### 4.1. `manifest.json`
Every archive MUST contain a `manifest.json` at the root describing the contents of the bundle:

```json
{
  "schemaVersion": 1,
  "machines": ["surveyor-3"],
  "quizzes": ["surveyor-3-quiz"]
}
```

- `schemaVersion`: Must be `1`.
- `machines`: Array of machine slugs matching folder names in `machines/<slug>/`.
- `quizzes`: (Optional) Array of quiz slugs matching folder names in `quizzes/<slug>/`.

### 4.2. `machines/<slug>/machine.json`
Defines the machine and all its relational sub-resources:

```json
{
  "body": "moon",
  "name": "Surveyor 3",
  "kind": "LANDER",
  "state": "JOB_FINISHED",
  "stateSince": "1967-05-04",
  "launchYear": 1967,
  "arrivalYear": 1967,
  "summary": "Third lunar lander of the Surveyor program, visited in 1969 by Apollo 12.",
  "description": "Surveyor 3 soft-landed inside a crater in Oceanus Procellarum on April 20, 1967.",
  "missionPurpose": "Demonstrate soft landings, photograph lunar terrain and sample regolith.",
  "howItWorked": "Three throttleable vernier engines and radar altimeter controlled touchdown.",
  "discoveries": "Scooped lunar soil and returned 6,315 television pictures of the surface.",
  "latitude": -3.015,
  "longitude": -23.418,
  "isPublished": true,
  "sources": [
    {
      "key": "src-1",
      "title": "NASA Space Science Data Coordinated Archive: Surveyor 3",
      "publisher": "NASA / NSSDC",
      "url": "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A"
    }
  ],
  "facts": [
    {
      "label": "Landed Mass",
      "value": "296.0",
      "unit": "kg",
      "sourceKey": "src-1",
      "sortOrder": 1
    }
  ],
  "timeline": [
    {
      "dateLabel": "April 17, 1967",
      "dateIso": "1967-04-17T07:13:00.000Z",
      "title": "Launch from Cape Kennedy",
      "description": "Launched aboard an Atlas-Centaur rocket into a lunar transfer trajectory.",
      "sourceKey": "src-1",
      "sortOrder": 1
    }
  ],
  "images": [
    {
      "filename": "surveyor3.png",
      "alt": "Surveyor 3 on the lunar surface photographed by Apollo 12 astronaut Alan Bean.",
      "label": "REAL_PHOTO",
      "credit": "NASA",
      "sourceUrl": "https://images.nasa.gov/details/AS12-48-7133",
      "isCover": true,
      "sortOrder": 1
    }
  ]
}
```

### 4.3. `quizzes/<slug>.json`
Defines an interactive quiz and its questions/options:

```json
{
  "title": "Surveyor 3 Lunar Pioneer Quiz",
  "level": "EXPLORER",
  "body": "moon",
  "machine": "surveyor-3",
  "isPublished": true,
  "questions": [
    {
      "prompt": "Which Apollo mission landed next to Surveyor 3 and retrieved parts of it?",
      "explanation": "Apollo 12 made a precision touchdown within walking distance of Surveyor 3 in November 1969.",
      "sortOrder": 1,
      "options": [
        { "label": "Apollo 11", "isCorrect": false, "sortOrder": 1 },
        { "label": "Apollo 12", "isCorrect": true, "sortOrder": 2 },
        { "label": "Apollo 13", "isCorrect": false, "sortOrder": 3 }
      ]
    }
  ]
}
```

---

## 5. Security & Validation Rules (Section 8)

The bundle ingestion pipeline executes 6 sequential verification gates. If any check fails, processing terminates immediately, returning an HTTP 422 Unprocessable Content response following the N12 error envelope.

### Rejection Codes & Conditions

1. **`ZIP_INVALID`**: The uploaded buffer is not a valid ZIP file or contains corrupted central directory headers.
2. **`ZIP_TOO_LARGE`**: Archive size exceeds 25 MB.
3. **`ZIP_TOO_MANY_ENTRIES`**: Archive contains more than 300 entries.
4. **`ZIP_BOMB_SUSPECTED`**: Any single entry decompression ratio exceeds 50:1, or uncompressed size exceeds limits (15 MB per entry / 120 MB total).
5. **`ZIP_ENCRYPTED`**: The archive or any entry within requires a password.
6. **`ZIP_PATH_TRAVERSAL`**: Entry name contains `..`, leading `/`, or Windows-style drive letters.
7. **`ZIP_FORBIDDEN_ENTRY`**: Contains macOS resource forks (`__MACOSX/`), hidden metadata (`.DS_Store`), path depth > 4, or filename length > 120.
8. **`FORBIDDEN_EXTENSION`**: Contains files with extensions outside `['json', 'jpg', 'jpeg', 'png', 'webp']` (e.g. `.exe`, `.svg`, `.sh`).
9. **`SIGNATURE_MISMATCH`**: Image magic bytes do not match file extension (e.g. text file renamed to `.jpg` or `.png`).
10. **`IMAGE_INVALID`**: Image corrupted, truncated, or dimensions exceed 4,000 × 4,000 px or 16 MP.
11. **`MANIFEST_MISSING`**: `manifest.json` is not present at the root of the archive.
12. **`MANIFEST_MISMATCH`**: A declared machine/quiz does not exist in the archive, or undeclared machine/quiz directories exist.
13. **`SCHEMA_INVALID`**: JSON fails Zod parsing (missing required fields, invalid types, invalid enums).
14. **`REFERENCE_UNKNOWN`**: Target celestial body (e.g. `"moon"`, `"mars"`) does not exist in the database, or quiz references an unknown `machineSlug`.
15. **`SOURCE_MISSING`**: A fact, event, or image references a `sourceKey` not declared in the machine's `sources` list.
16. **`URL_NOT_ALLOWED`**: Source URL host does not match allowed NASA hosts (`nasa.gov`, `jpl.nasa.gov`).
17. **`DUPLICATE_SLUG`**: The same machine or quiz slug appears more than once in the bundle or manifest.

---

## 6. Admin API Endpoints

All ingestion routes are mounted under `/api/v1/admin/ingestion` and require `ADMIN` role privileges:

- `GET /api/v1/admin/ingestion/spec`
  Returns current system quotas, allowed extensions, and supported rejection codes.
- `GET /api/v1/admin/ingestion/template.zip`
  Downloads an authentic, pre-validated reference ZIP bundle featuring *Surveyor 3*.
- `POST /api/v1/admin/ingestion/validate`
  Dry-run validation of an uploaded ZIP bundle. Returns validation report (`status: "VALIDATED"`) with zero writes to disk or database.
- `POST /api/v1/admin/ingestion`
  Full validation and transactional commit. On success:
  - Writes verified images to `public/images/machines/<slug>/`.
  - Atomically upserts machines, sources, facts, events, images, and quizzes in a single SQL transaction.
  - Creates an audit record in `ingestion_batches` (`status: "COMMITTED"`).
- `GET /api/v1/admin/ingestion/:id`
  Retrieves execution report and details of an ingestion batch by UUID.
