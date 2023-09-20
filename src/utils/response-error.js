class ResponseError extends Error {
    constructor(code, status, error) {
        super(error)
        this.status = status
        this.code = code
    }
}

export { ResponseError }
