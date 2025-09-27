import { toast } from "svelte-sonner";

type NotaErrorOptions = {
  toast?: Parameters<typeof toast>[1];
  cause?: unknown;
};

export class NotaError extends Error {
  constructor(message: string, options: NotaErrorOptions = {}) {
    super(message);
    this.name = "NotaError";
    if (options.toast) {
      toast(message, options.toast);
    }
  }
}