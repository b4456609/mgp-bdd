var nodegit = require("nodegit");
var path = require("path");
var fs = require('fs-extra');

var repoDir = "../movie-example/movie-uat";

var repository;

module.exports.pull = function() {
  // Open a repository that needs to be fetched and fast-forwarded
  return nodegit.Repository.open(repoDir).then(function(repo) {
    repository = repo;

    return repository.fetchAll();
  })
  // Now that we're finished fetching, go ahead and merge our local branch
  // with the new one
    .then(function() {
    return repository.mergeBranches("master", "origin/master");
  }).then(() => repository.getHeadCommit()).then(getCommitInfo);
}

module.exports.clone = function(url) {
  //remove bdd foler
  fs.removeSync(repoDir);
  return nodegit.Clone(url, repoDir).then(function(repository) {
    return repository.getHeadCommit()
  }).then(getCommitInfo);
}

module.exports.getLatestCommitInfo = () => {
  return nodegit.Repository.open(repoDir).then(function(repo) {
    return repo.getHeadCommit();
  }).then(getCommitInfo);
}

function getCommitInfo(commit) {
  return {id: commit.id().tostrS(), msg: commit.message()}
}
