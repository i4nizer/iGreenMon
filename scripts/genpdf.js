import fs from "fs"
import path from "path"
import PDFDocument from "pdfkit"

//

const DIRECTORIES = [
    `${process.cwd()}/app`,
    // `${process.cwd()}/server`,
    // `${process.cwd()}/shared`,
    // `${process.cwd()}/templates`,
]

//

const cpyfs = (dir) => {
	const fsres = []
    const files = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const file of files) {
        const fpath = path.join(dir, file.name)
        console.info(`Found ${fpath}`)
        
        if (file.isDirectory()) fsres.push(...cpyfs(fpath))
        else fsres.push(fpath)
    }

	return fsres.sort()
}

const genpdf = () => {
	const doc = new PDFDocument({ size: "A4", margin: 40 })
	const writeStream = fs.createWriteStream("source-code-dump.pdf")
	doc.pipe(writeStream)

	const files = DIRECTORIES.map((dir) => cpyfs(dir)).flat()

	for (let i = 0; i < files.length; i++) {
		const file = files[i]
		if (i > 0) doc.addPage()

        doc
            .fontSize(14)
            .fillColor("black")
            .text(file, { underline: true })
		doc.moveDown()

		const content = fs.readFileSync(file, "utf8")
        console.info(`Copying ${file}`)
        
        doc
            .font("C:/Users/ADMIN/Downloads/Montserrat,Roboto/Roboto/Roboto-VariableFont_wdth,wght.ttf")
            .fontSize(10)
            .text(content, { lineBreak: true })
	}

	doc.end()
	writeStream.on("finish", () => console.log(`Created source-code-dump.pdf`))
}

Promise.resolve()
	.then(genpdf)
	.catch((err) => console.error(err))
