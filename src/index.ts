import { Probot } from 'probot'
import { addRelease, editRelease, deleteRelease } from './mutations'

// release: {
//   url: 'https://api.github.com/repos/philiplehmann/cv/releases/44400431',
//   assets_url: 'https://api.github.com/repos/philiplehmann/cv/releases/44400431/assets',
//   upload_url: 'https://uploads.github.com/repos/philiplehmann/cv/releases/44400431/assets{?name,label}',
//   html_url: 'https://github.com/philiplehmann/cv/releases/tag/test',
//   id: 44400431,
//   author: [Object],
//   node_id: 'MDc6UmVsZWFzZTQ0NDAwNDMx',
//   tag_name: 'test',
//   target_commitish: 'main',
//   name: 'test',
//   draft: false,
//   prerelease: false,
//   created_at: '2021-05-24T17:07:46Z',
//   published_at: '2021-06-10T09:32:45Z',
//   assets: [],
//   tarball_url: 'https://api.github.com/repos/philiplehmann/cv/tarball/test',
//   zipball_url: 'https://api.github.com/repos/philiplehmann/cv/zipball/test',
//   body: 'body test asdfa\r\n'
// },

// https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#release
export = (app: Probot) => {
  app.on('release.released', async (context) => {
    const release = context.payload.release
    console.log(`new release ${release.id}`)
    await addRelease({
      name: release.name || '',
      release_id: release.id,
      release_published_at: release.published_at,
      release_created_at: release.created_at,
      tag_name: release.tag_name,
      body: release.body || '',
      html_url: release.html_url,
      url: release.url
    })
  })

  app.on('release.edited', async (context) => {
    const release = context.payload.release
    console.log(`edited release ${release.id}`)
    await editRelease({
      name: release.name || '',
      release_id: release.id,
      release_published_at: release.published_at,
      tag_name: release.tag_name,
      body: release.body || '',
      html_url: release.html_url,
      url: release.url
    })
  })

  app.on('release.deleted', async (context) => {
    const release = context.payload.release
    console.log(`delete release ${release.id}`)
    await deleteRelease({
      release_id: release.id
    })
  })

  app.on('installation.created', async (context) => {
    context.payload.repositories.forEach(async (repository) => {
      const owner = context.payload.installation.account.login
      const repo = repository.name

      console.log(`installed in ${owner}/${repo}`)
      const octoResponse = await context.octokit.repos.listReleases({ owner, repo })
      const releases = octoResponse.data

      console.log(`found ${releases.length} releases`)
      releases.forEach(async (release) => {
        await addRelease({
          name: release.name || '',
          release_id: release.id,
          release_published_at: release.published_at || '',
          release_created_at: release.created_at,
          tag_name: release.tag_name,
          body: release.body || '',
          html_url: release.html_url,
          url: release.url
        })
      })
    })
  })
}
