const nasm = require(__dirname + "/nasm-polyfill");

// Ejemplo de uso
nasm(`
  section .data
    msg db 'Hello, World!', 0x0A

  section .text
    global _start

  _start:
    ; Syscall para escribir el mensaje
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, 14
    syscall

    ; Syscall para salir del programa
    mov rax, 60
    xor rdi, rdi
    syscall
`);

console.log("Finished successfully!");