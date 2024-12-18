const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const https = require('https');

function isNasmInstalled() {
  try {
    execSync('nasm -v', { stdio: 'ignore' });
    return true;  // Si no lanza error, NASM está instalado
  } catch (error) {
    return false;  // Si lanza error, NASM no está instalado
  }
}

function installNasm() {
  const platform = os.platform();
  
  if (platform === 'linux') {
    console.log('NASM no encontrado. Intentando instalar NASM en Linux...');
    try {
      // Para sistemas Linux basados en Debian/Ubuntu
      execSync('sudo apt update && sudo apt install -y nasm', { stdio: 'inherit' });
      console.log('NASM instalado correctamente.');
    } catch (error) {
      console.error('Error al intentar instalar NASM:', error);
      process.exit(1); // Termina el proceso si la instalación falla
    }
  } else if (platform === 'win32') {
    console.log('NASM no encontrado. Por favor, descarga e instala NASM para Windows desde https://www.nasm.us/');
    process.exit(1);  // Termina el proceso, ya que la instalación en Windows no es tan simple
  } else {
    console.log('No se puede verificar la instalación de NASM en este sistema operativo.');
    process.exit(1);
  }
}

function nasm(code) {
  const asmFile = 'program.asm';
  const objFile = 'program.o';
  const execFile = 'program';

  // Verificar si NASM está instalado
  if (!isNasmInstalled()) {
    installNasm(); // Si no está instalado, lo intentamos instalar
  }

  // Escribir el código de ensamblador en un archivo
  fs.writeFileSync(asmFile, code);

  try {
    // Compilar el código ensamblador
    const compileCmd = os.platform() === 'win32' 
      ? `nasm -f win64 ${asmFile} -o ${objFile}` // Para Windows
      : `nasm -f elf64 ${asmFile} -o ${objFile}`; // Para Linux

    execSync(compileCmd);

    // Enlazar el archivo objeto dependiendo del sistema operativo
    const linkCmd = os.platform() === 'win32'
      ? `link ${objFile} /OUT:${execFile}.exe` // Para Windows
      : `ld ${objFile} -o ${execFile}`; // Para Linux

    execSync(linkCmd);

    // Ejecutar el archivo binario resultante
    const execCmd = os.platform() === 'win32'
      ? `.${execFile}.exe` // Para Windows
      : `./${execFile}`; // Para Linux

    const output = execSync(execCmd);
    console.log(output.toString());
  } catch (error) {
    console.error('Error durante la compilación o ejecución:', error);
  }
}

module.exports = nasm;