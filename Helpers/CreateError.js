class CreateError extends Error {
  constructor(message, status) {
    super(message);
    this.code = status;
  }
}

module.exports = CreateError;
