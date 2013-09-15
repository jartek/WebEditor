require 'dropbox_sdk'
class ProjectsController < ApplicationController

	before_filter :get_session,:only=>[:index,:create,:create_template]
  def index
	# puts client.account_info.inspect
	entries = @client.metadata(path='/',file_limit=100,list=true)
	contents = entries["contents"]
	@file_names = []
	contents.each { |a| @file_names << a['path'] }
	session.delete :dropbox_session
	flash[:success] = "You have successfully authorized with dropbox."
  end

  def new
  end

  def edit
  end

  def create 
		folder_name = params[:project_name].gsub(" ","_")
		entries = @client.file_create_folder(path=folder_name)
		create_template(entries["path"],"template_type")
		session.delete :dropbox_session
  end
  def destroy
  
  end

  def create_template(folder_path,template_type)
  	folders = ["js","css","html"]
  	folders.each do |folder|
  		folder_name = params[:project_name].gsub(" ","_")
		if folder == "html"
			templ = Templater.match_template(template_type)
			entries = @client.put_file(path= folder_path + '/' + 'index.html',templ)
			puts "$$$$$$$$$$$"
			puts entries[:data => templ]
			redirect_to editors_index_path(:data=>templ)
		else
			entries = @client.file_create_folder(path=folder_path+"/" + folder)
		end
		session.delete :dropbox_session
  	end

  end

  private 
  	def get_session
		dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
		dbsession.set_access_token(current_user.access_token,current_user.secret_token);
		@client = DropboxClient.new(dbsession, "dropbox")
  	end 

end
