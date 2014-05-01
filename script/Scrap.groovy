package org.kepennar.scraping

import groovy.json.JsonBuilder


@Grab(group='org.jsoup', module='jsoup', version='1.7.2')
	
def scrap() {
	def error = System.err.&println
	
	if (!args || args.size() <= 1) {
		error "You have to define the mode and the file to parse !!! "
		System.exit(0)
	}
	
	def filePath= args[1]
	def input = new File(filePath)
		
	def mode = args[0];
	if (mode == "console") scrapToConsole(input)
	else if (mode == "json") scrapToJson(input)
}

def scrapToConsole(File input) {
	def menus = scrapLink(input)
	menus.each { menu ->
		println "----------------------"
		println "-  ${menu.menuName}  -"
		println "----------------------"
		
		menu.links.each { link ->
			println "Link : Name= ${link.linkName} -> link = ${link.href}"	
		}
	}
	
}

def scrapToJson(File input) {
	def menus = scrapLink(input)
	println new JsonBuilder( menus ).toPrettyString()
}

def scrapLink(File input) {
	List<Menu> menus = []
	def doc = org.jsoup.Jsoup.parse(input, "UTF-8", "http://example.com/")
	doc.select("ul.cbp-tm-menu > li").each { menu ->
		def title = menu.select("a:eq(0)").first().text()
		
		def links = []
		menu.select(".cbp-tm-submenu a").each { link-> 
			links.add(new Link(linkName: link.text(), href: link.attr("href") ))
		}
		menus.add(new Menu(menuName: title, links: links))
	}
	return menus
}
scrap();




class Menu {
	String menuName;
	List<Link> links;
}
class Link {
	String linkName;
	String href;
}

