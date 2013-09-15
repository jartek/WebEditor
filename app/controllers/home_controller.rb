require 'dropbox_sdk'
class HomeController < ApplicationController
  def index
  	redirect_to projects_index_path if current_user
  end
end
