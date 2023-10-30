import { Decoder } from "./Decoder";
import { ensureAsyncIterable } from "./utils/stream";
import { defaultDecodeOptions } from "./decode";
import type { ReadableStreamLike } from "./utils/stream";
import type { DecodeOptions } from "./decode";
import type { SplitUndefined } from "./context";

export async function decodeAsync<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): Promise<unknown> {
  const stream = ensureAsyncIterable(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );
  return decoder.decodeAsync(stream);
}

export function decodeArrayStream<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): AsyncGenerator<unknown, void, unknown> {
  const stream = ensureAsyncIterable(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );

  return decoder.decodeArrayStream(stream);
}

export function decodeMultiStream<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): AsyncGenerator<unknown, void, unknown> {
  const stream = ensureAsyncIterable(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );

  return decoder.decodeStream(stream);
}

/**
 * @deprecated Use {@link decodeMultiStream()} instead.
 */
export function decodeStream<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): AsyncGenerator<unknown, void, unknown> {
  return decodeMultiStream(streamLike, options);
}
