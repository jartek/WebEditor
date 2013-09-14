require "dropbox_sdk"
class EditorsController < ApplicationController
  def index
  	get_files
  end



	# puts ")"*100
	# puts current_user.access_token
	# dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
	# dbsession.set_access_token(current_user.access_token,current_user.secret_token);
	# client = DropboxClient.new(dbsession, "dropbox")
	# puts "*"*100
	# # puts client.account_info.inspect
	# entries = client.metadata(path='/',file_limit=100,list=true)
	# contents = entries["contents"]
	# file_names = []
	# contents.each { |a| file_names << a['path'] }
 #    puts file_names
	# session.delete :dropbox_session
	# flash[:success] = "You have successfully authorized with dropbox."
 

 
# @Params : None
# @Return : None
# @Purpose : To callback for dropbox authorization
def dropbox_callback
 
# dbsession = DropboxSession.deserialize(session[:dropbox_session])
# dbsession.get_access_token #we've been authorized, so now request an access_token
# session[:dropbox_session] = dbsession.serialize
#current_user.update_attributes(:dropbox_session => session[:dropbox_session])
# puts ")"*100
# puts current_user.access_token
# dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
# dbsession.set_access_token(current_user.access_token,current_user.secret_token);
# client = DropboxClient.new(dbsession, "dropbox")
# puts "*"*100
# puts client.account_info.inspect
# entries = client.metadata(path='/BangaloreHack',file_limit=100,list=true)
# puts entries['contents']
# session.delete :dropbox_session
# flash[:success] = "You have successfully authorized with dropbox."

# redirect_to '/projects/index'
 
end

def get_files(path='/')
	dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
	dbsession.set_access_token(current_user.access_token,current_user.secret_token);
	client = DropboxClient.new(dbsession, "dropbox")
	puts "*"*100
	# puts client.account_info.inspect
	entries = client.metadata(path='/',file_limit=100,list=true)
	contents = entries["contents"]
	file_names = []
	contents.each { |a| file_names << a['path'] }
    puts file_names
	session.delete :dropbox_session
	flash[:success] = "You have successfully authorized with dropbox."
end
end
