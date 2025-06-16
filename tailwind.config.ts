
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#C04AE2',
					foreground: '#FFFFFF',
					50: '#F8F0FE',
					100: '#F0DCFC',
					500: '#C04AE2',
					600: '#A835C7',
					700: '#8F27AD',
					800: '#7A1E94',
					900: '#65167A'
				},
				secondary: {
					DEFAULT: '#F16389',
					foreground: '#FFFFFF',
					50: '#FEF0F3',
					100: '#FDD9E1',
					500: '#F16389',
					600: '#E53E69',
					700: '#D72851',
					800: '#B51E3F',
					900: '#951831'
				},
				success: {
					DEFAULT: '#03D99D',
					foreground: '#FFFFFF',
					50: '#EAFFFE',
					100: '#CCFFFB',
					500: '#03D99D',
					600: '#02B882',
					700: '#029B6E',
					800: '#027F5B',
					900: '#02674A'
				},
				warning: {
					DEFAULT: '#F28C35',
					foreground: '#FFFFFF',
					50: '#FEF3E7',
					100: '#FCE0C0',
					500: '#F28C35',
					600: '#E66E1A',
					700: '#C45711',
					800: '#A0470E',
					900: '#7F380B'
				},
				dark: {
					DEFAULT: '#090A40',
					foreground: '#FFFFFF',
					50: '#E6E6F1',
					100: '#CCCCDE',
					500: '#090A40',
					600: '#070835',
					700: '#05062B',
					800: '#040420',
					900: '#020216'
				},
				destructive: {
					DEFAULT: '#F16389',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: 'hsl(220 14.3% 95.9%)',
					foreground: 'hsl(220 8.9% 46.1%)'
				},
				accent: {
					DEFAULT: '#C04AE2',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: 'hsl(0 0% 100%)',
					foreground: 'hsl(222.2 84% 4.9%)'
				},
				card: {
					DEFAULT: 'hsl(0 0% 100%)',
					foreground: 'hsl(222.2 84% 4.9%)'
				},
				sidebar: {
					DEFAULT: 'hsl(0 0% 98%)',
					foreground: 'hsl(240 5.3% 26.1%)',
					primary: '#C04AE2',
					'primary-foreground': '#FFFFFF',
					accent: '#C04AE2',
					'accent-foreground': '#FFFFFF',
					border: 'hsl(220 13% 91%)',
					ring: '#C04AE2'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				lg: '1rem',
				md: '0.75rem',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1.5rem'
			},
			boxShadow: {
				'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
				'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
				'brand': '0 4px 16px rgba(192, 74, 226, 0.15)',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'float': 'float 3s ease-in-out infinite',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-4px)'
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
