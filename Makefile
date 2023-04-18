# Copyright (C) 2023  Luke Shumaker <lukeshu@lukeshu.com>
#
# SPDX-License-Identifier: Apache-2.0

generate/files  = LICENSE.txt

generate: generate-clean
	$(MAKE) $(generate/files)
.PHONY: generate

generate-clean:
	rm -f $(generate/files)
.PHONY: generate-clean

LICENSE.txt:
	curl https://apache.org/licenses/LICENSE-2.0.txt > $@
