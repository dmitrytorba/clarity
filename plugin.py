import os
import webbrowser

from lsp_utils import NpmClientHandler

def plugin_loaded():
    ClarityPlugin.setup()

def plugin_unloaded():
    ClarityPlugin.cleanup()

class ClarityPlugin(NpmClientHandler):
    package_name = __package__
    server_directory = 'clarity-language-server'
    server_binary_path = os.path.join(
        server_directory, 'main.js'
    )

