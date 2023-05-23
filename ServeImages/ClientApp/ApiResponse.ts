export type ApiResponse = {
    directories: Array<{
        Name: string
    }>,
    files: Array<{
        Name: string,
        Extension: string,
        Length: number
    }>
}