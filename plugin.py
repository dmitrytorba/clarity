import os
import webbrowser

from lsp_utils import NpmClientHandler


def plugin_loaded():
    LspEslintPlugin.setup()


def plugin_unloaded():
    LspEslintPlugin.cleanup()


class LspEslintPlugin(NpmClientHandler):
    package_name = __package__
    server_directory = 'clarity-language-server'
    server_binary_path = os.path.join(
        server_directory, 'node_modules', 'typescript-language-server', 'lib', 'cli.js'
    )

