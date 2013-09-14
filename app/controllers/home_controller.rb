require 'dropbox_sdk'
class HomeController < ApplicationController
  def index

    @dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
  end
end
