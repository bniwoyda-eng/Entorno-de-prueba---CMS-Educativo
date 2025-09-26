export const getEnvs = () => {
    import.meta.env;
    return {
        ...import.meta.env,
    }
}