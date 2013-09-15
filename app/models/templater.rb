class Templater

def self.match_template(type,url)
  return  "<html><head><title>#{type}</title><script src='#{url}' type='text/javascript'></script></head><body></body></html>"
end

end