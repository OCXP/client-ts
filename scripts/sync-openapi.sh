#!/bin/bash
# Sync OpenAPI spec and regenerate client-ts SDK
#
# Usage: ./scripts/sync-openapi.sh [API_URL]
# Example: ./scripts/sync-openapi.sh https://api.example.com
#
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_TS_DIR="$(dirname "$SCRIPT_DIR")"
BRAIN_DIR="$CLIENT_TS_DIR/../../contexthub/contexthub-brain"
API_URL="${1:-https://ix8b43sg3j.execute-api.us-west-2.amazonaws.com}"

echo "==> Generating OpenAPI spec from FastAPI..."
cd "$BRAIN_DIR/functions/ocxp/file_ops"
export PYTHONPATH="$BRAIN_DIR/functions/ocxp/file_ops:$PYTHONPATH"
python -c "
from app.main import create_app
import json
app = create_app()
spec = app.openapi()
spec['servers'] = [{'url': '$API_URL'}]
print(json.dumps(spec, indent=2))
" > "$BRAIN_DIR/schemas/openapi.json"
echo "    Created: contexthub-brain/schemas/openapi.json"

echo "==> Copying to client-ts..."
cp "$BRAIN_DIR/schemas/openapi.json" "$CLIENT_TS_DIR/openapi.json"
mkdir -p "$CLIENT_TS_DIR/schemas"
cp "$BRAIN_DIR/schemas/openapi.json" "$CLIENT_TS_DIR/schemas/openapi.json"
echo "    Copied to: client-ts/openapi.json"
echo "    Copied to: client-ts/schemas/openapi.json"

echo "==> Regenerating SDK types..."
cd "$CLIENT_TS_DIR"
npm run generate
echo "    Generated: src/generated/*"

echo "==> Building client-ts..."
npm run build
echo "    Built: dist/*"

echo "==> Done! SDK updated."
