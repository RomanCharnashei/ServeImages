export type ApiResponse = {
    directories: Array<{
        name: string
    }>,
    files: Array<{
        name: string,
        extension: string,
        length: number
    }>
}