from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    # Renderiza a sua página HTML principal
    return render_template('index.html')

# A correção principal está aqui: permitindo o método POST
@app.route('/converter', methods=['POST'])
def converter():
    dados = request.get_json()
    
    if not dados:
        return jsonify({"erro": "Nenhum dado enviado."}), 400

    origem = dados.get('origem')
    valor = dados.get('valor')

    try:
        # 1. Converte o valor de entrada para número decimal (base 10) com base na origem
        if origem == 'decimal':
            dec = int(valor, 10)
        elif origem == 'binario':
            dec = int(valor, 2)
        elif origem == 'hexadecimal':
            dec = int(valor, 16)
        elif origem == 'octal':
            dec = int(valor, 8)
        else:
            return jsonify({"erro": "Base de origem desconhecida."}), 400

        # 2. Gera os valores para todas as bases a partir do decimal
        resultado = {
            "entrada": valor,
            "decimal": str(dec),
            "binario": bin(dec)[2:],         # Remove o prefixo '0b'
            "hexadecimal": hex(dec)[2:].upper(), # Remove o prefixo '0x' e deixa em maiúsculas
            "octal": oct(dec)[2:]            # Remove o prefixo '0o'
        }

        # 3. Retorna os dados em formato JSON para o JavaScript
        return jsonify(resultado)

    except ValueError:
        # Caso o usuário digite letras no binário, por exemplo
        return jsonify({"erro": "O valor digitado é inválido para a base selecionada."}), 400

if __name__ == '__main__':
    app.run(debug=True)