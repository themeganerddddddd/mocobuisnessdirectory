# Montgomery County Business Directory

A static, responsive directory of 50 businesses selected from the supplied Directory.xlsx. It includes 20 life sciences, 3 satellite, 6 defense, and 21 technology companies, with 37 official company logos.

Serve `dist/` through any static HTTP server. No build or package installation is required. The application supports keyword search, combined industry and community filters, sorting, pagination, CSV download, and an accessible about dialog.

The public dataset contains company names, official website links, paraphrased descriptions, industry, specialty, and community. Company names open their official websites. Logo files are hosted locally; remaining slots use clearly typographic initials.

Research was reviewed October 26, 2026. Each selected company was matched to its source workbook sheet and row. Company and government sources establish its county office or facility. Forty-eight addresses matched Montgomery County, Maryland (FIPS 24031) in the U.S. Census geocoder. The two Seneca Meadows addresses were checked against exact-address Montgomery County Council agreements because Census could not match those street addresses. The detailed verification CSV is retained separately outside the website.

Browser verification covered keyword search, empty results, reset, combined industry and city filters, all five pages, sorting, official website anchors, the about dialog, logo loading, and mobile layout with no horizontal overflow.

The visual direction follows the supplied chamber directory's serif typography, restrained gold accents, filter bar, logo panels, and three-column business cards. This directory is independent and does not represent chamber membership or county government affiliation.
