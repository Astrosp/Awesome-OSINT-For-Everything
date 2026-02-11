[![npm](https://img.shields.io/npm/dw/node-email-verifier.svg)](https://www.npmjs.com/package/node-email-verifier)
[![Node.js CI](https://github.com/jesselpalmer/node-email-verifier/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/jesselpalmer/node-email-verifier/actions/workflows/nodejs-ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Install Size](https://packagephobia.com/badge?p=node-email-verifier)](https://packagephobia.com/result?p=node-email-verifier)
[![npm version](https://img.shields.io/npm/v/node-email-verifier.svg)](https://www.npmjs.com/package/node-email-verifier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sponsor](https://img.shields.io/badge/sponsor-%E2%9D%A4-pink)](https://github.com/sponsors/jesselpalmer)

# Node Email Verifier

Node Email Verifier is an email validation library for Node.js that checks if an email address has a
valid format and optionally verifies the domain's MX (Mail Exchange) records to ensure it can
receive emails. It also includes disposable email detection and detailed validation results.

## 🚀 Hosted API Available

**Need email verification without managing servers?** Check out [ValidKit](https://validkit.com) - a
hosted API built on this library with:

- ⚡ Sub-500ms response times
- 🤖 Native AI agent support (ChatGPT, Zapier, MCP)
- 📊 3,000+ disposable domains (vs 600+ in OSS)
- 🔄 Continuous updates & 99.9% uptime
- 🎁 Free tier available (no credit card required)

```bash
# Quick test with ValidKit API
curl -X POST https://api.validkit.com/api/v1/verify \
  -H "Content-Type: application/json" \
  -H "X-API-Key: vk_beta_test_key_123456789" \
  -d '{"email": "test@example.com"}'
```

[Get your free API key →](https://validkit.com)

### 💖 Sponsor This Project

**node-email-verifier** serves **50,000+ weekly downloads** on npm and is actively maintained.

If you find it helpful or use it in production, consider sponsoring to support continued
development, security updates, and new features.

**[Sponsor on GitHub →](https://github.com/sponsors/jesselpalmer)**

---

## Features

- **RFC 5322 Format Validation**: Validates email addresses against the standard email formatting
  rules.
- **MX Record Checking**: Verifies that the domain of the email address has valid MX records
  indicating that it can receive emails. This check can be disabled using a parameter.
- **Disposable Email Detection**: Identify and optionally block temporary/throwaway email services
  like 10minutemail, guerrillamail, etc.
- **Detailed Validation Results**: Get comprehensive validation information including specific
  failure reasons and validation metadata.
- **Customizable Timeout**: Allows setting a custom timeout for MX record checking.
- **TypeScript Support**: Written in TypeScript with full type definitions for better developer
  experience and IDE support.
- **ES Modules**: Modern ESM support with backward compatibility.
- **Zero Breaking Changes**: All new features are opt-in and maintain full backward compatibility.
- **MX Record Caching**: Built-in TTL-based caching with LRU eviction for improved performance in
  high-volume scenarios.

## Requirements

- **Node.js**: Version 18.0.0 or higher

## Installation

Install the package using npm:

```bash
npm install node-email-verifier --save
```

## Usage

This package supports both ES modules and CommonJS:

```javascript
// ES Modules (recommended)
import emailValidator from 'node-email-verifier';

// CommonJS
const emailValidator = require('node-email-verifier');
```

Note: When using CommonJS `require()`, the function returns a promise that resolves with the
validation result.

```javascript
// CommonJS usage example
const emailValidator = require('node-email-verifier');

// Since emailValidator returns a promise, handle it with async/await:
(async () => {
  const isValid = await emailValidator('test@example.com');
  console.log('Email is valid:', isValid);
})();

// Or with .then():
emailValidator('test@example.com')
  .then((isValid) => console.log('Email is valid:', isValid))
  .catch((error) => console.error('Validation error:', error));
```

Here's how to use Node Email Verifier in both JavaScript and TypeScript:

### JavaScript

#### ES Modules

```javascript
import emailValidator from 'node-email-verifier';

// Basic validation (format + MX checking)
async function validateEmail(email) {
  try {
    const isValid = await emailValidator(email);
    console.log(`Is "${email}" valid?`, isValid);
  } catch (error) {
    console.error('Validation error:', error);
  }
}
```

#### CommonJS

```javascript
const emailValidator = require('node-email-verifier');

// Basic validation (format + MX checking)
async function validateEmail(email) {
  try {
    const isValid = await emailValidator(email);
    console.log(`Is "${email}" valid?`, isValid);
  } catch (error) {
    console.error('Validation error:', error);
  }
}

// Disposable email detection
async function validateWithDisposableCheck(email) {
  try {
    const isValid = await emailValidator(email, {
      checkDisposable: true,
    });
    console.log(`Is "${email}" valid (blocking disposable)?`, isValid);
  } catch (error) {
    console.error('Validation error:', error);
  }
}

// Detailed validation results
async function getDetailedValidation(email) {
  try {
    const result = await emailValidator(email, {
      detailed: true,
      checkDisposable: true,
    });
    console.log('Detailed validation result:', result);
    /*
    Example output:
    {
      valid: false,
      email: 'test@10minutemail.com',
      format: { valid: true },
      mx: { valid: true, records: [...] },
      disposable: { 
        valid: false, 
        provider: '10minutemail.com',
        reason: 'Email from disposable provider'
      }
    }
    */
  } catch (error) {
    console.error('Validation error:', error);
  }
}

// Custom timeout and advanced options
async function validateWithCustomOptions(email) {
  try {
    const isValid = await emailValidator(email, {
      checkMx: true,
      checkDisposable: true,
      timeout: '500ms', // or timeout: 500 for milliseconds
    });
    console.log(`Is "${email}" valid with all checks?`, isValid);
  } catch (error) {
    if (error.message === 'DNS lookup timed out') {
      console.error('Timeout on DNS lookup.');
    } else {
      console.error('Validation error:', error);
    }
  }
}

// Format-only validation (fastest)
async function validateFormatOnly(email) {
  try {
    const isValid = await emailValidator(email, { checkMx: false });
    console.log(`Is "${email}" format valid?`, isValid);
  } catch (error) {
    console.error('Validation error:', error);
  }
}

// Usage examples
validateEmail('test@example.com');
validateWithDisposableCheck('test@10minutemail.com'); // → false
getDetailedValidation('invalid-email'); // → detailed error info
validateFormatOnly('test@example.com'); // → true (no MX check)
```

### TypeScript

#### ES Modules

```typescript
import emailValidator, {
  EmailValidatorOptions,
  ValidationResult,
  ErrorCode,
} from 'node-email-verifier';
import { isEmailValidationError } from 'node-email-verifier';

// Basic validation with typed options
async function validateEmailTyped(email: string): Promise<boolean> {
  const options: EmailValidatorOptions = {
    checkMx: true,
    checkDisposable: true,
    timeout: 5000,
  };

  try {
    const isValid = await emailValidator(email, options);
    console.log(`Is "${email}" valid?`, isValid);
    return isValid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// Detailed validation with typed results
async function getDetailedValidationTyped(email: string): Promise<ValidationResult> {
  const result = await emailValidator(email, {
    detailed: true,
    checkMx: true,
    checkDisposable: true,
  });

  // TypeScript infers this is ValidationResult when detailed: true
  if (!result.valid) {
    console.log('Validation failed:');

    if (!result.format.valid) {
      console.log('- Format issue:', result.format.reason);
    }

    if (result.disposable && !result.disposable.valid) {
      console.log('- Disposable email from:', result.disposable.provider);
    }

    if (result.mx && !result.mx.valid) {
      console.log('- MX issue:', result.mx.reason);
    }
  }

  return result;
}

// Error handling with error codes
async function handleValidationErrors(email: string): Promise<void> {
  try {
    const result = await emailValidator(email, {
      detailed: true,
      checkMx: true,
      checkDisposable: true,
      timeout: 5000,
    });

    // TypeScript infers this is ValidationResult when detailed: true
    if (!result.valid && result.errorCode === ErrorCode.INVALID_EMAIL_FORMAT) {
      throw new Error('Please enter a valid email address');
    }

    if (result.disposable?.errorCode === ErrorCode.DISPOSABLE_EMAIL) {
      throw new Error('Disposable email addresses are not allowed');
    }
  } catch (error) {
    if (isEmailValidationError(error) && error.code === ErrorCode.DNS_LOOKUP_TIMEOUT) {
      throw new Error('Email verification timed out. Please try again.');
    }
    throw error;
  }
}

// Type-safe inline validation
async function quickValidation(email: string): Promise<boolean> {
  const result = await emailValidator(email, {
    checkMx: false,
    checkDisposable: true, // Block disposable emails
    timeout: 2000,
  });
  // TypeScript infers this is boolean when detailed is false/undefined
  return result;
}

// Create specialized validators
function createValidator(options: EmailValidatorOptions) {
  return (email: string) => emailValidator(email, options);
}

const fastValidator = createValidator({
  checkMx: false,
  checkDisposable: false,
});

const businessValidator = createValidator({
  checkMx: true,
  checkDisposable: true,
  timeout: 10000,
});

const detailedValidator = createValidator({
  detailed: true,
  checkMx: true,
  checkDisposable: true,
});
```

#### CommonJS

When using CommonJS with TypeScript, you can still get full type support:

```typescript
// For CommonJS projects, use require with type imports
import type { EmailValidatorOptions, ValidationResult } from 'node-email-verifier';

const emailValidator = require('node-email-verifier');

// Basic validation with typed options
async function validateEmailCJS(email: string): Promise<boolean> {
  const options: EmailValidatorOptions = {
    checkMx: true,
    checkDisposable: true,
    timeout: 5000,
  };

  try {
    const isValid = await emailValidator(email, options);
    console.log(`Is "${email}" valid?`, isValid);
    return isValid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// Detailed validation with typed results
async function getDetailedValidationCJS(email: string): Promise<ValidationResult> {
  const result = await emailValidator(email, {
    detailed: true,
    checkMx: true,
    checkDisposable: true,
  });

  // TypeScript infers this is ValidationResult when detailed: true
  if (!result.valid) {
    console.log('Validation failed:');

    if (!result.format.valid) {
      console.log('- Format issue:', result.format.reason);
    }

    if (result.disposable && !result.disposable.valid) {
      console.log('- Disposable email from:', result.disposable.provider);
    }

    if (result.mx && !result.mx.valid) {
      console.log('- MX issue:', result.mx.reason);
    }
  }

  return result;
}

// Alternative: Use dynamic import in CommonJS for full type inference
async function validateWithDynamicImport(email: string): Promise<boolean> {
  const { default: emailValidator } = await import('node-email-verifier');

  return emailValidator(email, {
    checkMx: true,
    checkDisposable: true,
  });
}
```

## Examples

For more comprehensive examples, check out the [examples directory](./examples/):

- **[Basic Validation](./examples/basic-validation.js)** - Simple email validation patterns
- **[TypeScript Usage](./examples/typescript-usage.ts)** - Full TypeScript integration with types
- **[Bulk Validation](./examples/bulk-validation.js)** - Validating multiple emails efficiently
- **[Error Handling](./examples/error-handling.js)** - Using error codes and custom error handling
- **[CommonJS Usage](./examples/commonjs-usage.cjs)** - Legacy Node.js and CommonJS patterns
- **[Debug Mode](./examples/debug-mode.js)** - AI debug mode with structured logging (v3.3.0+)

Run any example:

```bash
node examples/basic-validation.js
```

## New Features (v3.1.0)

### Disposable Email Detection

Block temporary and throwaway email services to improve data quality:

```javascript
// Block disposable emails
const isValid = await emailValidator('test@10minutemail.com', {
  checkDisposable: true,
}); // → false

// Allow disposable emails (default behavior)
const isValid = await emailValidator('test@10minutemail.com', {
  checkDisposable: false,
}); // → true (if format and MX are valid)
```

**Supported disposable providers**: 600+ domains including 10minutemail, guerrillamail, yopmail,
tempmail, mailinator, and many more.

### Detailed Validation Results

Get comprehensive validation information with specific failure reasons:

```javascript
// Get detailed validation results
const result = await emailValidator('test@10minutemail.com', {
  detailed: true,
  checkMx: true,
  checkDisposable: true,
});

console.log(result);
/*
Output:
{
  "valid": false,
  "email": "test@10minutemail.com",
  "format": { "valid": true },
  "mx": { 
    "valid": true, 
    "records": [{"exchange": "mx.10minutemail.com", "priority": 10}] 
  },
  "disposable": { 
    "valid": false, 
    "provider": "10minutemail.com",
    "reason": "Email from disposable provider",
    "errorCode": "DISPOSABLE_EMAIL" 
  }
}
*/

// Handle validation results
if (!result.valid) {
  if (!result.format.valid) {
    console.log('Invalid email format:', result.format.reason);
  }

  if (result.disposable && !result.disposable.valid) {
    console.log('Disposable email detected:', result.disposable.provider);
  }

  if (result.mx && !result.mx.valid) {
    console.log('MX validation failed:', result.mx.reason);
  }
}
```

### Error Codes (v3.2.0+)

Detailed validation results now include error codes for programmatic error handling:

```javascript
const result = await emailValidator('invalid-email', {
  detailed: true,
  checkMx: true,
  checkDisposable: true,
});

// Check specific error codes
if (!result.valid) {
  if (result.errorCode) {
    console.log('Top-level error:', result.errorCode);
  }

  switch (result.format.errorCode) {
    case ErrorCode.EMAIL_MUST_BE_STRING:
      console.log('Email must be a string');
      break;
    case ErrorCode.EMAIL_CANNOT_BE_EMPTY:
      console.log('Email cannot be empty');
      break;
    case ErrorCode.INVALID_EMAIL_FORMAT:
      console.log('Invalid email format');
      break;
  }

  if (result.mx?.errorCode) {
    switch (result.mx.errorCode) {
      case ErrorCode.NO_MX_RECORDS:
        console.log('No mail server found');
        break;
      case ErrorCode.DNS_LOOKUP_FAILED:
        console.log('DNS lookup error');
        break;
      case ErrorCode.DNS_LOOKUP_TIMEOUT:
        console.log('DNS lookup timed out');
        break;
      case ErrorCode.MX_SKIPPED_DISPOSABLE:
        console.log('MX check skipped due to disposable email');
        break;
    }
  }

  if (result.disposable?.errorCode === ErrorCode.DISPOSABLE_EMAIL) {
    console.log('Disposable email detected');
  }
}
```

```javascript
// Handle thrown errors
import emailValidator, { ErrorCode } from 'node-email-verifier';

try {
  await emailValidator('test@example.com', { timeout: -1 });
} catch (error) {
  if (error.code === ErrorCode.INVALID_TIMEOUT_VALUE) {
    console.log('Invalid timeout configuration');
  }
}
```

**Available Error Codes:**

- `EMAIL_MUST_BE_STRING` - Email is not a string
- `EMAIL_CANNOT_BE_EMPTY` - Email string is empty
- `INVALID_EMAIL_FORMAT` - Email format is invalid
- `NO_MX_RECORDS` - No MX records found for domain
- `DNS_LOOKUP_FAILED` - DNS lookup encountered an error
- `DNS_LOOKUP_TIMEOUT` - DNS lookup timed out
- `MX_SKIPPED_DISPOSABLE` - MX check was skipped because email is disposable
- `MX_LOOKUP_FAILED` - MX record lookup failed for unknown reason
- `DISPOSABLE_EMAIL` - Email is from a disposable provider
- `INVALID_TIMEOUT_VALUE` - Invalid timeout parameter
- `UNKNOWN_ERROR` - An unknown error occurred

### AI Debug Mode (v3.3.0+)

Enable structured logging for debugging and observability:

```javascript
const result = await emailValidator('test@example.com', {
  debug: true, // Enable debug mode
  checkMx: true,
  checkDisposable: true,
  detailed: true,
});

// Debug logs are written to console.log as JSON:
// {
//   "type": "email-validator-debug",
//   "timestamp": "2025-06-22T10:30:45.123Z",
//   "phase": "mx_record_check",
//   "email": "test@example.com",
//   "data": { "domain": "example.com", "timeoutMs": 10000 },
//   "timing": { "start": 123.45 },
//   "memory": { "heapUsed": 12345678, "heapTotal": 23456789, "rss": 34567890 }
// }
```

**Debug Mode Features:**

- **Structured JSON logs**: MCP-compatible format for AI tooling
- **Timing information**: Track duration of each validation phase
- **Memory usage**: Monitor heap and RSS memory for each operation
- **Error tracking**: Detailed error logs with stack traces
- **Phase tracking**: See the flow through format check, disposable check, and MX validation

#### Example: Production Debug Wrapper

```javascript
// Intercept debug logs for analysis
const debugLogs = [];
const originalLog = console.log;
console.log = (message) => {
  try {
    const parsed = JSON.parse(message);
    if (parsed.type === 'email-validator-debug') {
      debugLogs.push(parsed);
    }
  } catch (e) {
    originalLog(message);
  }
};

// Run validation
const result = await emailValidator(email, { debug: true });

// Restore console.log and analyze
console.log = originalLog;
console.log(`Validation took ${debugLogs.length} steps`);
```

See the [debug mode example](./examples/debug-mode.js) for more advanced usage patterns.

### MX Record Caching (v3.4.0+)

Improve performance for high-volume email validation with built-in MX record caching:

```javascript
// Basic usage - caching is enabled by default
const isValid = await emailValidator('test@example.com', {
  checkMx: true,
});

// Configure cache settings
const result = await emailValidator('test@example.com', {
  checkMx: true,
  detailed: true,
  cache: {
    enabled: true, // Enable caching (default: true)
    defaultTtl: 600000, // 10 minutes TTL (default: 5 minutes)
    maxSize: 5000, // Store up to 5000 domains (default: 1000)
  },
});

// Cache statistics in detailed results
console.log(result.cacheStats);
// {
//   hits: 42,           // Number of cache hits
//   misses: 8,          // Number of cache misses
//   size: 50,           // Current cache size
//   evictions: 0,       // Number of evicted entries
//   hitRate: 84.00      // Cache hit rate percentage
// }

// Check if result was served from cache
if (result.mx?.cached) {
  console.log('MX records were served from cache');
}
```

**Cache Management:**

```javascript
import { globalMxCache } from 'node-email-verifier';

// Clear entire cache
globalMxCache.flush();

// Clear specific domain
globalMxCache.delete('example.com');

// Get cache statistics
const stats = globalMxCache.getStatistics();
console.log(`Cache hit rate: ${stats.hitRate}%`);

// Reset statistics (keeps cached data)
globalMxCache.resetStatistics();
```

**Performance Benefits:**

- **Dramatic Performance Improvement**: Real-world benchmarks show significant speedup over no
  caching
  - **7.7x faster** with realistic DNS latency (25ms per lookup)
  - **87%+ cache hit rate** in typical usage patterns with mixed domain popularity
  - **872 DNS lookups avoided** out of 1000 requests (87.2% reduction)
- **LRU Eviction Strategy**: Intelligent cache management that keeps frequently accessed domains in
  memory longer than less popular ones
- **Bulk Validation**: Eliminates redundant DNS lookups for repeated domains
  - Each DNS lookup typically takes 50-200ms depending on network conditions
  - **65+ seconds saved** in real DNS lookup time per 1000 validations
  - Performance improvement scales with network latency
- **Rate Limiting**: Reduces DNS queries to external servers
- **Memory Efficient**: LRU eviction with automatic cleanup of expired entries
- **TTL Respect**: Honors DNS TTL semantics

### Combining Features

```javascript
// Use all features together
const result = await emailValidator(email, {
  checkMx: true, // Verify MX records
  checkDisposable: true, // Block disposable emails
  detailed: true, // Get detailed results
  timeout: '5s', // Custom timeout
  debug: true, // Enable debug logging
});

// Business-friendly validation
const isBusinessEmail = await emailValidator(email, {
  checkMx: true,
  checkDisposable: true, // Block temporary emails
  timeout: '10s',
}); // Returns boolean for simple usage
```

## Package Configuration

This package supports both ES modules and CommonJS through the `exports` field in `package.json`.
Key configuration details:

- **`"type": "module"`**: Designates this as an ES module package
- **`"main"`**: Points to `./dist/index.js` for legacy compatibility
- **`"types"`**: TypeScript definitions at `./dist/index.d.ts` for both module systems
- **`"exports"`**: Modern Node.js module resolution with conditional exports:
  - `"import"`: ES module entry point (`./dist/index.js`)
  - `"require"`: CommonJS entry point (`./dist/index.cjs`)
  - `"types"`: Shared TypeScript definitions (`./dist/index.d.ts`)
- **Node Version**: Requires Node.js 18.0.0 or higher
- **Build Process**: TypeScript compilation + automatic CommonJS wrapper generation

For the complete configuration, see the [package.json](./package.json) file.

This configuration ensures the package works correctly with:

- `import emailValidator from 'node-email-verifier'` (ES modules)
- `const emailValidator = require('node-email-verifier')` (CommonJS)
- TypeScript projects using either module system
- Bundlers like webpack, Rollup, and Vite
- Modern Node.js versions (18+) with proper module resolution

## API

### `emailValidator(email, [opts]): Promise<boolean | ValidationResult>`

Validates the given email address with comprehensive validation options including format checking,
MX record verification, disposable email detection, and detailed results.

#### Handling Return Types

```js
// Type-safe handling of both return types
async function handleValidation(email) {
  const result = await emailValidator(email, {
    checkDisposable: true,
    detailed: true, // This determines the return type
  });

  // When detailed: true, result is ValidationResult
  if (typeof result === 'object') {
    console.log('Detailed validation:');
    console.log('Valid:', result.valid);

    if (!result.valid) {
      if (!result.format.valid) {
        console.log('Format error:', result.format.reason);
      }

      if (result.disposable && !result.disposable.valid) {
        console.log('Disposable provider:', result.disposable.provider);
      }
    }

    return result.valid;
  }

  // When detailed: false (default), result is boolean
  console.log('Simple validation:', result);
  return result;
}

// TypeScript automatically infers the correct type based on options
const detailedResult = await emailValidator(email, { detailed: true }); // ValidationResult
const booleanResult = await emailValidator(email, { detailed: false }); // boolean
```

#### Parameters

- **`email`** (`unknown`): The email address to validate. Can be any type, but only strings will be
  considered valid.
- **`opts`** (`EmailValidatorOptions | boolean`, optional): Configuration options or a boolean for
  backward compatibility.

#### Options (`EmailValidatorOptions`)

```typescript
interface EmailValidatorOptions {
  checkMx?: boolean; // Whether to check for MX records (default: true)
  checkDisposable?: boolean; // Whether to check for disposable emails (default: false)
  detailed?: boolean; // Return detailed validation results (default: false)
  timeout?: string | number; // Timeout for DNS lookup (default: '10s')
  debug?: boolean; // Enable debug mode with structured logging (default: false)
  cache?: MxCacheOptions; // MX record caching configuration (default: enabled)
}

// See "Type Definitions" section below for ValidationResult interface
```

- **`checkMx`** (`boolean`, optional): Whether to check for MX records. Defaults to `true`.
- **`checkDisposable`** (`boolean`, optional): Whether to check for disposable email providers.
  Defaults to `false`.
- **`detailed`** (`boolean`, optional): Return detailed validation results instead of boolean.
  Defaults to `false`.
- **`timeout`** (`string | number`, optional): The timeout for the DNS MX lookup. Can be:
  - A number in milliseconds (e.g., `5000`)
  - A string in ms format (e.g., `'5s'`, `'2000ms'`, `'1m'`)
  - Defaults to `'10s'` (10 seconds)
- **`debug`** (`boolean`, optional): Enable debug mode for structured logging. When true, logs
  detailed timing and memory usage information to console.log as JSON. Defaults to `false`.
- **`cache`** (`MxCacheOptions`, optional): Configure MX record caching behavior. Caching is enabled
  by default with a 5-minute TTL. Options:
  - `enabled` (`boolean`): Enable/disable caching. Default: `true`
  - `defaultTtl` (`number`): TTL in milliseconds. Default: `300000` (5 minutes)
  - `maxSize` (`number`): Maximum cache entries. Default: `1000`

#### Backward Compatibility

For backward compatibility, you can also pass a boolean as the second parameter:

- `true`: Enable MX checking (equivalent to `{ checkMx: true }`)
- `false`: Disable MX checking (equivalent to `{ checkMx: false }`)

#### Returns

**`Promise<boolean | ValidationResult>`**: A promise that resolves to:

- `boolean` (when `detailed: false` or not specified):
  - `true` if the email address passes all enabled validations
  - `false` if the email address fails any enabled validation
- `ValidationResult` (when `detailed: true`):
  - Comprehensive validation information including specific failure reasons
  - Always includes `format` validation results
  - Includes `mx` results only when `checkMx: true`
  - Includes `disposable` results only when `checkDisposable: true`

#### Throws

- **`Error`**: When DNS lookup times out, the error message will be "DNS lookup timed out"

## TypeScript Benefits

This library is written in TypeScript and provides several benefits for TypeScript users:

- **Type Safety**: Full type checking for all parameters and return values
- **IntelliSense**: Rich autocomplete and documentation in your IDE
- **Interface Exports**: Import and use the `EmailValidatorOptions` interface in your own code
- **Compile-time Error Detection**: Catch mistakes before runtime

### Type Definitions

The library exports the following types:

```typescript
// Import the types and utilities from the library
// Types are imported separately from runtime values for clarity
import type {
  ErrorCode,
  MxRecord,
  ValidationResult,
  EmailValidatorOptions,
  CacheStatistics,
  MxCacheOptions,
} from 'node-email-verifier';
import { EmailValidationError, isEmailValidationError } from 'node-email-verifier';

// Main function type
declare function emailValidator(
  email: unknown,
  opts?: EmailValidatorOptions | boolean
): Promise<boolean | ValidationResult>;

// Options interface
export interface EmailValidatorOptions {
  checkMx?: boolean;
  checkDisposable?: boolean;
  detailed?: boolean;
  timeout?: string | number;
  debug?: boolean;
  cache?: MxCacheOptions;
}

// MX cache configuration
export interface MxCacheOptions {
  enabled?: boolean;
  defaultTtl?: number;
  maxSize?: number;
}

// Cache statistics
export interface CacheStatistics {
  hits: number;
  misses: number;
  size: number;
  evictions: number;
  hitRate: number;
}

// MX record type
export interface MxRecord {
  exchange: string;
  priority: number;
}

// Validation result interface
export interface ValidationResult {
  valid: boolean;
  email: string;
  errorCode?: ErrorCode; // Top-level error code for quick access
  format: {
    valid: boolean;
    reason?: string;
    errorCode?: ErrorCode;
  };
  mx?: {
    valid: boolean;
    records?: MxRecord[];
    reason?: string;
    errorCode?: ErrorCode;
    cached?: boolean; // Whether result was from cache
  };
  disposable?: {
    valid: boolean;
    provider?: string | null;
    reason?: string;
    errorCode?: ErrorCode;
  };
  cacheStats?: CacheStatistics; // Cache statistics when cache is enabled
}

// Error handling types
export class EmailValidationError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, message?: string);
}

// Type guard for error handling
export function isEmailValidationError(error: unknown): error is EmailValidationError;
```

## Production Usage

When using this library in production environments, especially with MX record checking enabled, it's
important to consider DNS rate limiting. For detailed guidance on:

- Implementing request throttling
- Adding retry logic with exponential backoff
- Caching MX records
- Monitoring DNS failures

See our [API Best Practices Guide](docs/API_BEST_PRACTICES.md).

## Development

### Available Scripts

- **`npm run build`** - Compile TypeScript to JavaScript
- **`npm run test`** - Run the test suite
- **`npm run lint`** - Check JavaScript/TypeScript code for linting issues
- **`npm run lint:fix`** - Automatically fix JavaScript/TypeScript linting issues
- **`npm run lint:md`** - Check Markdown files for linting issues
- **`npm run lint:md:fix`** - Automatically fix Markdown linting issues
- **`npm run lint:yaml`** - Check YAML files for validity
- **`npm run lint:all`** - Run all linters (JS/TS, Markdown, YAML)
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check if code is properly formatted
- **`npm run check`** - Run all linting, formatting, and tests
- **`npm run precommit`** - Fix linting, format code, and run tests
- **`npm run benchmark`** - Run performance benchmarks for disposable domain lookups
- **`npm run benchmark:init`** - Run initialization and memory usage benchmarks
- **`npm run benchmark:all`** - Run all benchmarks

### Code Quality

This project uses:

- **ESLint** for JavaScript/TypeScript linting
- **Markdownlint** for Markdown file linting
- **yaml-lint** for YAML file validation
- **Prettier** for code formatting (JS/TS, JSON, Markdown, YAML)
- **Jest** for testing with TypeScript integration

Before committing, run `npm run precommit` to ensure code quality.

### Git Hooks

This project uses [husky](https://typicode.github.io/husky/) and
[lint-staged](https://github.com/okonet/lint-staged) to maintain code quality:

- **Pre-commit**: Automatically fixes linting issues and formats staged files
- **Pre-push**: Runs the full test suite to prevent pushing broken code

These hooks are installed automatically when you run `npm install`.

## Project Structure

```text
node-email-verifier/
├── src/              # Source TypeScript files
├── dist/             # Built JavaScript files and CommonJS wrapper
├── test/             # Test files (unit and integration tests)
├── scripts/          # Build scripts and performance benchmarks
├── docs/             # Additional documentation
│   ├── AI_WORKFLOW.md                    # AI-assisted PR workflow guide
│   ├── API_BEST_PRACTICES.md            # Rate limiting and production usage
│   ├── ESM_COMMONJS_COMPATIBILITY.md    # Module compatibility guide
│   ├── INTEGRATION_TESTING.md           # Integration testing guide
│   └── PERFORMANCE.md                   # Performance benchmarks and analysis
└── examples/         # (Coming soon) Example usage scripts
```

## Roadmap

Check out our [Feature Enhancement Roadmap](FEATURE_ENHANCEMENTS.md) to see what's coming next and
what we're working on. We welcome feedback and contributions on these planned features!

## Contributing

Contributions are always welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed
information about:

- Development setup
- Code quality standards
- Available npm scripts
- Testing guidelines
- Commit message format

Quick start:

```bash
npm install
npm run check  # Run all quality checks
```

Feel free to submit a PR!

## Support This Project

If you find Node Email Verifier useful, please consider supporting its development:

- **[GitHub Sponsors](https://github.com/sponsors/jesselpalmer)**
- **[Buy Me a Coffee](https://www.buymeacoffee.com/jesselpalmer)**

Your support helps maintain this project and fund new features. Thank you! 💖

## License

This project is licensed under the MIT License.
