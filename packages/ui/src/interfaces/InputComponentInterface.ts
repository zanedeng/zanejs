export interface InputComponentInterface {
  disabled?: boolean;
  getComponentId(): Promise<string>;
  name: string;

  required?: boolean;
  setBlur(): void;
  setFocus(): void;
}
