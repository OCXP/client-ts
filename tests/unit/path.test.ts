/**
 * Path Utilities Unit Tests
 *
 * Tests for path parsing and building utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  parsePath,
  normalizePath,
  isValidContentType,
  getCanonicalType,
  buildPath,
  VALID_CONTENT_TYPES,
} from '../../src/path';

describe('VALID_CONTENT_TYPES', () => {
  it('should contain all 8 content types', () => {
    expect(VALID_CONTENT_TYPES).toHaveLength(8);
    expect(VALID_CONTENT_TYPES).toContain('mission');
    expect(VALID_CONTENT_TYPES).toContain('project');
    expect(VALID_CONTENT_TYPES).toContain('context');
    expect(VALID_CONTENT_TYPES).toContain('sop');
    expect(VALID_CONTENT_TYPES).toContain('repo');
    expect(VALID_CONTENT_TYPES).toContain('artifact');
    expect(VALID_CONTENT_TYPES).toContain('kb');
    expect(VALID_CONTENT_TYPES).toContain('docs');
  });
});

describe('isValidContentType', () => {
  it('should return true for valid content types', () => {
    VALID_CONTENT_TYPES.forEach((type) => {
      expect(isValidContentType(type)).toBe(true);
    });
  });

  it('should return false for invalid content types', () => {
    expect(isValidContentType('invalid')).toBe(false);
    expect(isValidContentType('')).toBe(false);
    expect(isValidContentType('MISSION')).toBe(false); // case sensitive
  });
});

describe('getCanonicalType', () => {
  it('should return canonical type for aliases', () => {
    expect(getCanonicalType('missions')).toBe('mission');
    expect(getCanonicalType('projects')).toBe('project');
    expect(getCanonicalType('contexts')).toBe('context');
    expect(getCanonicalType('sops')).toBe('sop');
    expect(getCanonicalType('repos')).toBe('repo');
    expect(getCanonicalType('artifacts')).toBe('artifact');
    expect(getCanonicalType('kbs')).toBe('kb');
  });

  it('should return canonical type for canonical types', () => {
    VALID_CONTENT_TYPES.forEach((type) => {
      expect(getCanonicalType(type)).toBe(type);
    });
  });

  it('should return undefined for unknown types', () => {
    expect(getCanonicalType('unknown')).toBeUndefined();
    expect(getCanonicalType('random')).toBeUndefined();
  });
});

describe('normalizePath', () => {
  it('should convert plural to singular forms', () => {
    expect(normalizePath('missions/test.md')).toBe('mission/test.md');
    expect(normalizePath('projects/my-project')).toBe('project/my-project');
    expect(normalizePath('contexts/config.yaml')).toBe('context/config.yaml');
    expect(normalizePath('sops/procedure.md')).toBe('sop/procedure.md');
    expect(normalizePath('repos/my-repo')).toBe('repo/my-repo');
    expect(normalizePath('artifacts/output.zip')).toBe('artifact/output.zip');
    expect(normalizePath('kbs/doc.md')).toBe('kb/doc.md');
  });

  it('should not change already normalized paths', () => {
    expect(normalizePath('mission/test.md')).toBe('mission/test.md');
    expect(normalizePath('project/my-project')).toBe('project/my-project');
    expect(normalizePath('docs/readme.md')).toBe('docs/readme.md');
  });
});

describe('parsePath', () => {
  it('should parse simple content type path', () => {
    const result = parsePath('mission/test.md');
    expect(result.type).toBe('mission');
    expect(result.id).toBe('test.md');
  });

  it('should parse nested path', () => {
    const result = parsePath('project/subdir/another/file.json');
    expect(result.type).toBe('project');
    expect(result.id).toBe('subdir/another/file.json');
  });

  it('should handle content type aliases', () => {
    const result = parsePath('missions/test.md');
    expect(result.type).toBe('mission');
    expect(result.id).toBe('test.md');
  });

  it('should handle leading slash', () => {
    const result = parsePath('/context/config.yaml');
    expect(result.type).toBe('context');
    expect(result.id).toBe('config.yaml');
  });

  it('should throw for invalid content type', () => {
    expect(() => parsePath('invalid/test.md')).toThrow('Invalid content type');
  });

  it('should handle content type only path', () => {
    const result = parsePath('mission/');
    expect(result.type).toBe('mission');
    expect(result.id).toBeUndefined();
  });

  it('should throw for empty path', () => {
    expect(() => parsePath('')).toThrow('Invalid path');
  });
});

describe('buildPath', () => {
  it('should build path from type and id', () => {
    expect(buildPath('mission', 'test.md')).toBe('mission/test.md');
    expect(buildPath('project', 'sub/dir/file.json')).toBe('project/sub/dir/file.json');
  });

  it('should handle empty id with trailing slash', () => {
    expect(buildPath('mission')).toBe('mission/');
    expect(buildPath('kb')).toBe('kb/');
  });

  it('should handle undefined id', () => {
    expect(buildPath('mission', undefined)).toBe('mission/');
    expect(buildPath('project', undefined)).toBe('project/');
  });
});
