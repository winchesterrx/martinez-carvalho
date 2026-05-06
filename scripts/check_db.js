import pool from '../api/db.js';

async function check() {
  const [rows] = await pool.query('SELECT * FROM conhecimento_site ORDER BY id DESC LIMIT 1');
  console.log("Título:", rows[0].titulo);
  console.log("Sistema:", rows[0].sistema);
  console.log("Conteúdo (Trecho):", rows[0].conteudo.substring(0, 500));
  process.exit();
}

check();
