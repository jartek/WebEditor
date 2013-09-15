require "dropbox_sdk"
require "open-uri"
require 'net/http'
RootCA = '/etc/ssl/certs'
class EditorsController < ApplicationController

def index
 puts ";"*100
 puts params[:file_link]

 @url = URI.parse params[:file_link].gsub(" ","_")
 http = Net::HTTP.new(@url.host, @url.port)
 http.use_ssl = (@url.scheme == 'https')
 if (File.directory?(RootCA) && http.use_ssl?)
  http.ca_path = RootCA
  http.verify_mode = OpenSSL::SSL::VERIFY_PEER
  http.verify_depth = 5
 else
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE 
 end
 request = Net::HTTP::Get.new(@url.path)
 request.basic_auth @url.user, @url.password
 response = http.request(request)
 puts "$$$$"
 @body = response.body
 @body = @body.html_safe.gsub(/[^>]*(\n)/, '').gsub(/(")|(')/, "\"")
 puts @body
 get_files
  end

def dropbox_callback
 
end

def get_files(path='/')
	dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
	dbsession.set_access_token(current_user.access_token,current_user.secret_token);
	client = DropboxClient.new(dbsession, "dropbox")
	# puts client.account_info.inspect
	entries = client.metadata(path='/',file_limit=100,list=true)
	contents = entries["contents"]
	@file_names = []
	contents.each { |a| @file_names << a['path'] }
	session.delete :dropbox_session
	flash[:success] = "You have successfully authorized with dropbox."
end

def to_s
  attributes.each_with_object("") do |attribute, result|
    result << "#{attribute[1].to_s} "
  end
end
end
