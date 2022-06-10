import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SESSION_COOKIE } from '../constants';
import { dataSource } from '../dataSource';
import { Board } from '../entity';

test.group('createBoard', () => {
  test('should throw error not authenticated', async ({ expect, client }) => {
    const queryData = {
      query: `
        mutation CreateBoard {
          createBoard {
            id
            title
            description
          }
        }
      `,
      variables: {}
    };

    const response = await client.post('/').json(queryData)
    const { data, errors } = response.body()

    expect(data).toBeNull()
    expect(errors).toBeDefined()
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('not authenticated')
  })

  test('should create board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const title = faker.lorem.words()
    const description = faker.lorem.sentences()

    const queryData = {
      query: `
        mutation Mutation($description: String, $title: String) {
          createBoard(description: $description, title: $title) {
            id
            title
            description
          }
        }
      `,
      variables: {
        title,
        description
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.createBoard).toBeDefined()
    expect(data.createBoard.title).toBe(title)
    expect(data.createBoard.description).toBe(description)

    const { id } = data.createBoard
    const board = await dataSource.getRepository(Board).findOneBy({ id })

    expect(board).toBeDefined()
    expect(board).toMatchObject({ title, description })
    expect(board.userId).toBe(user.id)
  })

})
