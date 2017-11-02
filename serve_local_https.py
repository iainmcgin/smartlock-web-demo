#!/usr/bin/env python

import argparse
import atexit
import logging
import os
import sys
import tempfile
from subprocess import call
import BaseHTTPServer
import SimpleHTTPServer
import ssl

logging.basicConfig(level=logging.INFO)

parser = argparse.ArgumentParser(description='')
parser.add_argument('--host', dest='host', default='localhost')
parser.add_argument('--port', dest='port', type=int, default=4443)
args = parser.parse_args()

server_host = args.host
server_port = args.port
ssl_cert_path = '{}/server.pem'.format(tempfile.gettempdir())

OpenSslExecutableNotFoundError = OSError


def create_ssl_cert():
    DEVNULL = open(os.devnull, 'wb')

    try:
        ssl_exec_list = ['openssl', 'req', '-new', '-x509', '-keyout', ssl_cert_path,
                         '-out', ssl_cert_path, '-days', '365', '-nodes',
                         '-subj', '/CN=Local Testing Cert/O=X/C=US']
        call(ssl_exec_list, stdout=DEVNULL, stderr=DEVNULL)
    except OpenSslExecutableNotFoundError:
        logging.error('openssl executable not found!')
        exit(1)

    logging.info(
        'Self signed ssl certificate created at {}'.format(ssl_cert_path))


def exit_handler():
    # remove certificate file
    os.remove(ssl_cert_path)

    logging.info('Bye!')

create_ssl_cert()
atexit.register(exit_handler)

logging.info(
    'Server running... https://{}:{}'.format(server_host, server_port))
httpd = BaseHTTPServer.HTTPServer(
    (server_host, server_port), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(
    httpd.socket, certfile=ssl_cert_path, server_side=True)
httpd.serve_forever()
