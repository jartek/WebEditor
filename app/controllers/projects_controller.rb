require 'dropbox_sdk'
class ProjectsController < ApplicationController
  def index
  	puts ")"*100
	puts current_user.access_token
	dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
	dbsession.set_access_token(current_user.access_token,current_user.secret_token);
	client = DropboxClient.new(dbsession, "dropbox")
	puts "*"*100
	# puts client.account_info.inspect
	entries = client.metadata(path='/',file_limit=100,list=true)
	contents = entries["contents"]
	puts contents.inspect
	@file_names = []
	contents.each { |a| @file_names << a['path'] }
    puts @file_names
	session.delete :dropbox_session
	flash[:success] = "You have successfully authorized with dropbox."
  end

  def new
  end

  def edit
  end

  def create 
	folder_name = params[:project_name]
	dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
	#serialize and save this DropboxSession
	session[:dropbox_session] = dbsession.serialize
	#pass to get_authorize_url a callback url that will return the user here
	redirect_to dbsession.get_authorize_url url_for(:action => 'dropbox_callback',:type => "create",:folder_name => folder_name) 
  end
  def destroy
  end

  def create_folder
  	
  end

  def dropbox_callback
  	type = params[:type]
  	folder_name = params[:folder_name]
  	if type == "create"
	  	dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
		dbsession.set_access_token(current_user.access_token,current_user.secret_token);
		client = DropboxClient.new(dbsession, "dropbox")
		puts "*"*100
		puts folder_name
		puts client.file_create_folder(path=folder_name)
		entries = client.file_create_folder(path=folder_name)
		puts entries['contents']
		session.delete :dropbox_session
		flash[:success] = "You have successfully authorized with dropbox."
  	else
  		#MGB LOOK HERE! 
  	end
  end

end
