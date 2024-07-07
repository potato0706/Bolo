export class CommandNotFoundError extends Error {
  /**
   * Indicates that a command was not found
   * @param commandName The name of the command that was not found
   */
  constructor(commandName: string) {
    super(commandName);
    this.name = 'CommandNotFoundError';
    this.message = `The command ${commandName} was not found in the command directory.`;
  }
}

export class MissingExportError extends Error {
  /**
   * Indicates that a required export is missing in a file
   * @param filePath The path to the file where the export is missing
   */
  constructor(filePath: string) {
    super(filePath);
    this.name = 'NoExportError';
    this.message = `A required export is missing in ${filePath}.`;
  }
}

export class MissingPropertyError extends Error {
  /**
   * Indicates that a required property is missing in a file
   * @param filePath The path to the file where the property is missing
   */
  constructor(filePath: string) {
    super(filePath);
    this.name = 'MissingPropertyError';
    this.message = `A required property is missing in ${filePath}.`;
  }
}
