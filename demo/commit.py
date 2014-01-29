# -*- coding: utf-8 -*-

from itertools import islice
from pygit2 import (Repository,
                    GIT_SORT_TIME,
                    GIT_SORT_TOPOLOGICAL,
                    GIT_SORT_REVERSE)


class Commit(object):
    def __init__(self, sha, parents):
        self.sha = sha
        self.parents = parents

    @classmethod
    def gets(cls, path, max_count=100, order=GIT_SORT_TIME):
        """gets commits from a git repository.

        :param path: The normalized path to the git repository.
        :param max_count: max count of commits.
        :param order: order commits list."""
        repo = Repository(path)
        return [cls(c.hex, [p.hex for p in c.parents])
                for c in islice(repo.walk(repo.head.target, order),
                                max_count)]
