<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<meta name="robots" content="noindex,follow" />
				<style type="text/css">
					body {
						font-family: Helvetica, Arial, sans-serif;
						font-size: 13px;
						color: #545353;
					}
					table {
						border: none;
						border-collapse: collapse;
					}
					#sitemap tr.odd {
						background-color: #eee;
					}
					#sitemap tbody tr:hover {
						background-color: #ccc;
					}
					#sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
						color: #000;
					}
					#content {
						margin: 0 auto;
						width: 1000px;
					}
					.expl {
						margin: 10px 3px;
						line-height: 1.3em;
					}
					.expl a {
						color: #da3114;
						font-weight: bold;
					}
					a {
						color: #000;
						text-decoration: none;
					}
					a:visited {
						color: #777;
					}
					a:hover {
						text-decoration: underline;
					}
					td {
						font-size:11px;
					}
					th {
						text-align:left;
						padding-right:30px;
						font-size:11px;
					}
					thead th {
						border-bottom: 1px solid #000;
						cursor: pointer;
					}
				</style>
			</head>
			<body>
				<xsl:apply-templates></xsl:apply-templates>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="sitemap:urlset">
        <div id="content">
			<h1>XML Sitemap</h1>
			<p class="expl">
				This is an XML Sitemap, meant for consumption by search engines.
			</p>
			<p class="expl">
				You can find more information about XML sitemaps on <a href="http://sitemaps.org">sitemaps.org</a>.
			</p>
			<p class="expl">
				This sitemap contains <xsl:value-of select="count(./sitemap:url)"/> URLs.
			</p>
			<table id="sitemap" cellpadding="3">
				<thead>
					<tr>
						<th width="75%">URL</th>
						<th width="5%">Priority</th>
						<th width="5%">Change Freq.</th>
						<th width="10%">Last Change</th>
					</tr>
				</thead>
				<tbody>
					<xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
					<xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
					<xsl:for-each select="./sitemap:url">
						<tr>
							<td>
								<xsl:variable name="itemURL">
									<xsl:value-of select="sitemap:loc"/>
								</xsl:variable>
								<a href="{$itemURL}">
									<xsl:value-of select="sitemap:loc"/>
								</a>
							</td>
							<td>
								<xsl:value-of select="concat(sitemap:priority*100,'%')"/>
							</td>
							<td>
								<xsl:value-of select="concat(translate(substring(sitemap:changefreq, 1, 1),concat($lower, $upper),concat($upper, $lower)),substring(sitemap:changefreq, 2))"/>
							</td>
							<td>
								<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))"/>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</div>
	</xsl:template>


	<xsl:template match="sitemap:sitemapindex">
        <div id="content">
			<h1>XML Sitemap Index</h1>
			<p class="expl">
				This is an XML Sitemap, meant for consumption by search engines.
			</p>
			<p class="expl">
				You can find more information about XML sitemaps on <a href="http://sitemaps.org">sitemaps.org</a>.
			</p>
			<p class="expl">
				This file contains links to sub-sitemaps, follow them to see the actual sitemap content.
			</p>
			<table id="sitemap" cellpadding="3">
				<thead>
					<tr>
    					<th width="75%">URL of sub-sitemap</th>
    					<th width="25%">Last modified (GMT)</th>
					</tr>
				</thead>
				<tbody>
    				<xsl:for-each select="./sitemap:sitemap">
    					<tr>
    						<xsl:if test="position() mod 2 != 1">
    							<xsl:attribute  name="class">high</xsl:attribute>
    						</xsl:if>
    						<td>
    							<xsl:variable name="itemURL">
    								<xsl:value-of select="sitemap:loc"/>
    							</xsl:variable>
    							<a href="{$itemURL}">
    								<xsl:value-of select="sitemap:loc"/>
    							</a>
    						</td>
    						<td>
    							<xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))"/>
    						</td>
    					</tr>
    				</xsl:for-each>
				</tbody>
			</table>
		</div>
	</xsl:template>
</xsl:stylesheet>
