import { Probot } from "probot";
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
  app.on("release.released", async (context) => {
    console.log('released', context)
    const release = context.payload.release
    const response = await addRelease({
      name: release.name || '',
      release_id: release.id,
      release_published_at: release.published_at,
      release_created_at: release.created_at,
      tag_name: release.tag_name,
      body: release.body || '',
      html_url: release.html_url,
      url: release.url
    })
    console.log('released', response)
  });

  app.on("release.edited", async (context) => {
    console.log('edited', context)
    const release = context.payload.release
    const response = await editRelease({
      name: release.name || '',
      release_id: release.id,
      release_published_at: release.published_at,
      tag_name: release.tag_name,
      body: release.body || '',
      html_url: release.html_url,
      url: release.url
    })
    console.log('edited', response)
  });

  app.on("release.deleted", async (context) => {
    console.log('deleted', context)
    const release = context.payload.release
    const response = await deleteRelease({
      release_id: release.id
    })
    console.log('deleted', response)
  });

  app.on("installation.created", async (context) => {
    console.log('installed', context)
    context.payload.repositories.forEach(async (repository) => {
      const octoResponse = await context.octokit.repos.listReleases({ owner: context.payload.installation.account.login, repo: repository.name })
      const releases = octoResponse.data
      releases.forEach(async (release) => {
        const response = await addRelease({
          name: release.name || '',
          release_id: release.id,
          release_published_at: release.published_at || '',
          release_created_at: release.created_at,
          tag_name: release.tag_name,
          body: release.body || '',
          html_url: release.html_url,
          url: release.url
        })
        console.log('installed', response)
      })
    })
  })
};
