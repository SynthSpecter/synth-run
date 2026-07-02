// Module de lecture de fichiers / File reading module
const fs = require('node:fs')
// Module HTTP natif de Node / Native Node HTTP module
const http = require('node:http')
// Module pour construire des chemins fiables / Module used to build reliable paths
const path = require('node:path')

// Serveur local sans dépendance / Dependency-free local server
// Dossier racine servi au navigateur / Root folder served to the browser
const rootDir = path.resolve(__dirname, '..')
// Port par défaut du serveur / Default server port
const port = Number.parseInt(process.env.PORT || '4174', 10)

// Types MIME envoyés selon l'extension / MIME types sent according to extension
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ttf': 'font/ttf',
}

// Crée le serveur et répond à chaque requête / Create the server and answer each request
const server = http.createServer((request, response) => {
  // Transforme l'URL reçue en objet facile à lire / Convert the request URL into an easy-to-read object
  const url = new URL(request.url, `http://${request.headers.host}`)
  // La racine du site renvoie index.html / The site root returns index.html
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname
  // Construit le chemin réel du fichier demandé / Build the real path of the requested file
  const filePath = path.normalize(path.join(rootDir, requestedPath))

  // Bloque les chemins qui sortiraient du projet / Block paths that would escape the project
  if (!filePath.startsWith(rootDir)) {
    sendResponse(response, 403, 'text/plain; charset=utf-8', 'Forbidden')
    return
  }

  // Lit le fichier demandé / Read the requested file
  fs.readFile(filePath, (error, content) => {
    // Si le fichier n'existe pas, on renvoie 404 / If the file does not exist, return 404
    if (error) {
      sendResponse(response, 404, 'text/plain; charset=utf-8', 'Not found')
      return
    }

    // Récupère l'extension pour choisir le type MIME / Get extension to choose MIME type
    const extension = path.extname(filePath).toLowerCase()
    // Envoie le fichier au navigateur / Send the file to the browser
    sendResponse(
      response,
      200,
      contentTypes[extension] || 'application/octet-stream',
      content,
    )
  })
})

// Démarre l'écoute du serveur / Start listening for browser requests
server.listen(port, () => {
  console.log(`Synth Run is running at http://localhost:${port}`)
})

// Fonction utilitaire pour répondre proprement / Helper function to send a clean response
function sendResponse(response, statusCode, contentType, body) {
  // Envoie les en-têtes HTTP / Send HTTP headers
  response.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  })
  // Termine la réponse avec le contenu / Finish the response with content
  response.end(body)
}
