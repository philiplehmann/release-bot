import { gql } from '@apollo/client'

export const ADD_RELEASE = gql`
mutation AddRelease($name: String!, $release_id: Int!, $release_published_at: timestamptz!, $release_created_at: timestamptz!, $tag_name: String!, $body: String!, $html_url: String!, $url: String!) {
  insert_releases(objects: { name: $name, release_id: $release_id, release_published_at: $release_published_at, release_created_at: $release_created_at, tag_name: $tag_name, body: $body, html_url: $html_url, url: $url }) {
    returning {
      body
      html_url
      id
      name
      release_created_at
      release_id
      release_published_at
      tag_name
      url
    }
  }
}
`

export const EDIT_RELEASE = gql`
mutation EditRelease($name: String!, $release_id: Int!, $release_published_at: timestamptz!, $tag_name: String!, $body: String!, $html_url: String!, $url: String!) {
  update_releases(where: {release_id: {_eq: $release_id}}, _set: {body: $body, html_url: $html_url, name: $name, release_published_at: $release_published_at, tag_name: $tag_name, url: $url}) {
    returning {
      body
      html_url
      id
      name
      release_created_at
      release_id
      release_published_at
      tag_name
      url
    }
  }
}
`

export const DELETE_RELEASE = gql`
mutation DeleteRelease($release_id: Int!) {
  delete_releases(where: {release_id: {_eq: $release_id}}) {
    returning {
      id
    }
  }
}
`