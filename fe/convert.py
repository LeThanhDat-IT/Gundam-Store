import os

files = [
    r'e:\gundam-model\fe\src\pages\shop\Cart.jsx',
    r'e:\gundam-model\fe\src\pages\shop\Checkout.jsx',
    r'e:\gundam-model\fe\src\pages\shop\Contact.jsx',
    r'e:\gundam-model\fe\src\pages\shop\Orders.jsx'
]

replacements = {
    'bg-[#121212]': 'bg-white',
    'bg-[#1a1a1a]': 'bg-white',
    'bg-[#0d0d0d]': 'bg-gray-50',
    'bg-[#111111]': 'bg-white',
    'bg-[#141414]': 'bg-white',
    'bg-black': 'bg-gray-50',
    'bg-black/50': 'bg-white',
    'border-gray-800': 'border-gray-200',
    'border-gray-700': 'border-gray-200',
    'border-gray-600': 'border-gray-300',
    'text-gray-200': 'text-gray-800',
    'text-gray-300': 'text-gray-700',
    'text-gray-400': 'text-gray-600',
    'text-white': 'text-gray-900',
    'text-blue-400': 'text-blue-600',
    'shadow-2xl shadow-black/40': 'shadow-sm',
    'shadow-xl shadow-black/30': 'shadow-sm',
    'shadow-2xl': 'shadow-md',
    'shadow-xl': 'shadow-sm',
    'text-gray-500 hover:text-red-500': 'text-gray-500 hover:text-red-600',
    'text-red-400': 'text-red-600',
    'text-red-500': 'text-red-600',
    'bg-blue-500/15': 'bg-blue-50 border border-blue-200',
    'bg-green-500/15 text-green-400': 'bg-green-50 text-green-700 border border-green-200',
    'bg-yellow-500/15 text-yellow-400': 'bg-yellow-50 text-yellow-700 border border-yellow-200'
}

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
