export default class Environment {
  constructor();
  restore(): void;
  set(name: string, value: string|number|Boolean): void;
}
