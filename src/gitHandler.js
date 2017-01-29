var nodegit = require("nodegit");
var path = require("path");
var fs = require('fs-extra');

var repoDir = "./bdd";

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
  });
}

module.exports.clone = function() {
  //remove bdd foler
  fs.removeSync(repoDir);
  return nodegit.Clone("https://github.com/b4456609/easylearn-uat.git", repoDir).then(function(repository) {
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
