// Configuração do Tailwind CSS
tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['Fira Code', 'monospace'],
                    },
                    colors: {
                        brand: {
                            decimal: '#3B82F6',   // Blue
                            binary: '#10B981',    // Emerald
                            hex: '#8B5CF6',       // Purple
                            octal: '#F59E0B'      // Amber
                        }
                    }
                }
            }
        }

// Lógica e interações da página
// ---------------------------------------------------------------------
        // ALGORITMOS DE CONVERSÃO MANUAIS (PROPRIO MÉTODO - SEM PARSEINT OU TOSTRING)
        // Conforme exigência estrita do documento do trabalho.
        // ---------------------------------------------------------------------

        // 1. Converter Decimal Inteiro para Binário via Divisões Sucessivas por 2
        function decimalParaBinarioManual(num) {
            if (num === 0) return "0";
            let res = "";
            let temp = num;
            while (temp > 0) {
                let resto = temp % 2;
                res = resto + res;
                temp = Math.floor(temp / 2);
            }
            return res;
        }

        // 2. Converter Decimal Inteiro para Hexadecimal via Divisões Sucessivas por 16
        function decimalParaHexaManual(num) {
            if (num === 0) return "0";
            const hexMap = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
            let res = "";
            let temp = num;
            while (temp > 0) {
                let resto = temp % 16;
                res = hexMap[resto] + res;
                temp = Math.floor(temp / 16);
            }
            return res;
        }

        // 3. Converter Decimal Inteiro para Octal via Divisões Sucessivas por 8
        function decimalParaOctalManual(num) {
            if (num === 0) return "0";
            let res = "";
            let temp = num;
            while (temp > 0) {
                let resto = temp % 8;
                res = resto + res;
                temp = Math.floor(temp / 8);
            }
            return res;
        }

        // 4. Converter Qualquer Base (Binário, Hexa, Octal) para Decimal Inteiro via Somatório de Potências
        function baseParaDecimalManual(numStr, base) {
            let str = String(numStr).toUpperCase().trim();
            let decimalAcc = 0;
            let potencia = 0;

            const charValueMap = {
                '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
                '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
            };

            for (let i = str.length - 1; i >= 0; i--) {
                let char = str[i];
                let val = charValueMap[char];
               
                // Validação de dígitos conforme a base
                if (val === undefined || val >= base) {
                    throw new Error(`O caractere '${char}' não é um dígito válido na base ${base}.`);
                }

                decimalAcc += val * Math.pow(base, potencia);
                potencia++;
            }
            return decimalAcc;
        }


        // ---------------------------------------------------------------------
        // HANDLER DE CONVERSÃO E EXIBIÇÃO NO MODAL
        // ---------------------------------------------------------------------
        function converterPartindoDe(baseOrigem) {
            let valInput = "";
            let numDecimal = 0;

            try {
                if (baseOrigem === 'decimal') {
                    valInput = document.getElementById('input-decimal').value.trim();
                    if (valInput === "" || isNaN(valInput) || Number(valInput) < 0) {
                        alert("Por favor, digite um número inteiro decimal válido (>= 0).");
                        return;
                    }
                    numDecimal = Math.floor(Number(valInput));
                }
                else if (baseOrigem === 'binario') {
                    valInput = document.getElementById('input-binario').value.trim();
                    if (valInput === "") {
                        alert("Por favor, digite uma sequência de números binários (0 e 1).");
                        return;
                    }
                    numDecimal = baseParaDecimalManual(valInput, 2);
                }
                else if (baseOrigem === 'hexadecimal') {
                    valInput = document.getElementById('input-hexadecimal').value.trim();
                    if (valInput === "") {
                        alert("Por favor, digite um valor Hexadecimal válido (ex: FF, 1A).");
                        return;
                    }
                    numDecimal = baseParaDecimalManual(valInput, 16);
                }
                else if (baseOrigem === 'octal') {
                    valInput = document.getElementById('input-octal').value.trim();
                    if (valInput === "") {
                        alert("Por favor, digite um valor Octal válido (dígitos de 0 a 7).");
                        return;
                    }
                    numDecimal = baseParaDecimalManual(valInput, 8);
                }

                // Cálculo dos Resultados usando algoritmos manuais
                let decResult = String(numDecimal);
                let binResult = decimalParaBinarioManual(numDecimal);
                let hexResult = decimalParaHexaManual(numDecimal);
                let octResult = decimalParaOctalManual(numDecimal);

                // Atualizar Modal
                document.getElementById('modal-valor-entrada').innerText = `${valInput} (${baseOrigem.toUpperCase()})`;
                document.getElementById('modal-origem-label').innerText = baseOrigem.toUpperCase();

                document.getElementById('res-decimal').innerText = decResult;
                document.getElementById('res-binario').innerText = binResult;
                document.getElementById('res-hexadecimal').innerText = hexResult;
                document.getElementById('res-octal').innerText = octResult;

                // Destacar a caixa de origem ou ocultar a correspondente se desejado
                abrirModal();

            } catch (err) {
                alert("Erro na conversão: " + err.message);
            }
        }


        // ---------------------------------------------------------------------
        // CONTROLE DA INTERFACE E NAVEGAÇÃO
        // ---------------------------------------------------------------------
        function switchTab(tabId) {
            // Ocultar todas as seções
            const pages = ['inicio', 'conversor', 'integrantes', 'codigo'];
            pages.forEach(p => {
                const el = document.getElementById('page-' + p);
                if (el) el.classList.add('hidden');

                const navBtn = document.getElementById('nav-' + p);
                if (navBtn) {
                    navBtn.classList.remove('text-indigo-400', 'bg-slate-800/80', 'border', 'border-slate-700/50');
                    navBtn.classList.add('text-slate-400');
                }
            });

            // Exibir a seção escolhida
            const targetPage = document.getElementById('page-' + tabId);
            if (targetPage) targetPage.classList.remove('hidden');

            const activeBtn = document.getElementById('nav-' + tabId);
            if (activeBtn) {
                activeBtn.classList.add('text-indigo-400', 'bg-slate-800/80', 'border', 'border-slate-700/50');
                activeBtn.classList.remove('text-slate-400');
            }

            // Ocultar menu mobile ao selecionar
            document.getElementById('mobile-menu').classList.add('hidden');
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Modal Logic
        function abrirModal() {
            const modal = document.getElementById('modal-resultado');
            const container = document.getElementById('modal-container');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                container.classList.remove('scale-95', 'opacity-0');
                container.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function fecharModal() {
            const modal = document.getElementById('modal-resultado');
            const container = document.getElementById('modal-container');
            container.classList.remove('scale-100', 'opacity-100');
            container.classList.add('scale-95', 'opacity-0');
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        // Copiar texto para Clipboard sem alert()
        function copiarTexto(elementId) {
            const text = document.getElementById(elementId).innerText;
           
            // Usando execCommand para compatibilidade iFrame
            const dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);

            mostrarToast(`Valor "${text}" copiado!`);
        }

        function mostrarToast(mensagem) {
            const toast = document.getElementById('toast-notification');
            const toastMsg = document.getElementById('toast-message');
            toastMsg.innerText = mensagem;
           
            toast.classList.remove('translate-y-20', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

        // Code Inspector Tabs
        function showCodeTab(tabName) {
            const tabs = ['app_py', 'requirements', 'readme'];
            tabs.forEach(t => {
                document.getElementById('code-' + t).classList.add('hidden');
                document.getElementById('tab-' + t).classList.remove('border-emerald-500', 'text-emerald-400', 'font-semibold');
                document.getElementById('tab-' + t).classList.add('border-transparent', 'text-slate-400');
            });

            document.getElementById('code-' + tabName).classList.remove('hidden');
            document.getElementById('tab-' + tabName).classList.add('border-emerald-500', 'text-emerald-400', 'font-semibold');
            document.getElementById('tab-' + tabName).classList.remove('border-transparent', 'text-slate-400');
        }

        function copyPythonCode() {
            const codeText = document.querySelector('#code-app_py code').innerText;
            const dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = codeText;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);

            mostrarToast("Código app.py copiado com sucesso!");
        }
