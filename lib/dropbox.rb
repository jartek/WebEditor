# Defines the Dropbox module.

require 'cgi'
require 'yaml'
require 'digest/sha1'
require 'thread'
require 'set'
require 'time'
require 'tempfile'

require 'dropbox/extensions/array'
require 'dropbox/extensions/hash'
require 'dropbox/extensions/module'
require 'dropbox/extensions/object'
require 'dropbox/extensions/string'
require 'dropbox/extensions/to_bool'

require 'dropbox/memoization'
require 'dropbox/api'
require 'dropbox/entry'
require 'dropbox/event'
require 'dropbox/revision'
require 'dropbox/session'

# Container module for the all Dropbox API classes.

module Dropbox
  # The API version this client works with.
  VERSION = "0"
  # The host to authenticate user.
  AUTH_HOST = "http://www.dropbox.com"
  # The SSL host to authenticate user.
  AUTH_SSL_HOST = "https://www.dropbox.com"
  # The host serving API requests.
  HOST = "http://api.dropbox.com"
  # The SSL host serving API requests.
  SSL_HOST = "https://api.dropbox.com"
  # Alternate hosts for other API requests.
  ALTERNATE_HOSTS = {
    'event_content' => 'http://api-content.dropbox.com',
    'files' => 'http://api-content.dropbox.com',
    'thumbnails' => 'http://api-content.dropbox.com'
  }
  # Alternate SSL hosts for other API requests.
  ALTERNATE_SSL_HOSTS = {
    'event_content' => 'https://api-content.dropbox.com',
    'files' => 'https://api-content.dropbox.com',
    'thumbnails' => 'https://api-content.dropbox.com'
  }

  def self.api_url(*paths_and_options) # :nodoc:
    params = paths_and_options.extract_options!
    ssl = params.delete(:ssl)
    host = (ssl ? ALTERNATE_SSL_HOSTS[paths_and_options.first] : ALTERNATE_HOSTS[paths_and_options.first]) || (ssl ? SSL_HOST : HOST)
    url = "#{host}/#{VERSION}/#{paths_and_options.map { |path_elem| CGI.escape path_elem.to_s }.join('/')}"
    url.gsub! '+', '%20' # dropbox doesn't really like plusses
    url << "?#{params.map { |k,v| CGI.escape(k.to_s) + "=" + CGI.escape(v.to_s) }.join('&')}" unless params.empty?
    return url
  end

  def self.check_path(path) # :nodoc:
    raise ArgumentError, "Backslashes are not allowed in Dropbox paths" if path.include?('\\')
    raise ArgumentError, "File names are limited to 255 characters" if path.split('/').last.size > 255 unless path.empty?
    return path
  end
end
