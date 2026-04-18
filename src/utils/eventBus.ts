class EventBus {
  private target = new EventTarget();

  emit<T = unknown>(event: string, detail?: T) {
    this.target.dispatchEvent(new CustomEvent<T>(event, { detail }));
  }

  on<T = unknown>(event: string, callback: (data: T) => void): () => void {
    const handler = (e: Event) => {
      callback((e as CustomEvent<T>).detail);
    };

    this.target.addEventListener(event, handler);

    return () => {
      this.target.removeEventListener(event, handler);
    };
  }
}

export const eventBus = new EventBus();
