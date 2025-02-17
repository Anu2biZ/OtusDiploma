export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Фейковая проверка логина (в реальности тут была бы проверка в БД)
    if (body.username === 'admin' && body.password === 'admin') {
        return {
            token: 'fake_jwt_token',
            user: {
                id: 1,
                username: body.username,
                role: 'admin'
            }
        }
    }

    // В случае неверных данных возвращаем ошибку
    throw createError({
        statusCode: 401,
        message: 'Неверный логин или пароль'
    })
})
