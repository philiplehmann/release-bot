import fetch from 'cross-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ADD_RELEASE, EDIT_RELEASE, DELETE_RELEASE } from './query'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GRAPHQL_URL,
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_SECRET || '',
      'content-type': 'application/json'
    },
    fetch
  })
})
interface ReleaseEditBody {
  name: string
  release_id: number
  release_published_at: string
  tag_name: string
  body: string
  html_url: string
  url: string
}
interface ReleaseAddBody extends ReleaseEditBody {
  release_created_at: string
}
interface ReleaseDeleteBody {
  release_id: number
}
export const addRelease = async (variables: ReleaseAddBody) => {
  return await client.mutate({ mutation: ADD_RELEASE, variables })
}
export const editRelease = async (variables: ReleaseEditBody) => {
  return await client.mutate({ mutation: EDIT_RELEASE, variables })
}
export const deleteRelease = async (variables: ReleaseDeleteBody) => {
  return await client.mutate({ mutation: DELETE_RELEASE, variables })
}