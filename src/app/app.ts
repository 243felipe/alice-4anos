import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Declaração do EmailJS
declare const emailjs: any;

interface ConfirmationData {
  nome: string;
  presenca: string;
  adultos: number;
  criancas0a4: number;
  criancas5plus: number;
  observacao?: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  // Configurações do EmailJS
  private readonly EMAILJS_CONFIG = {
    serviceId: 'service_90xdwfc',
    templateId: 'template_38v4b9w',
    publicKey: 'sGnWCCSumuEsaM9Bd',
    emailDestino: 'fcunha326@gmail.com'
  };

  // Sinais para gerenciamento de estado
  countdown = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  adultos = signal(1);
  criancas0a4 = signal(0);
  criancas5plus = signal(0);
  totalPessoas = computed(() => this.adultos() + this.criancas0a4() + this.criancas5plus());
  isSubmitting = signal(false);
  showSuccessModal = signal(false);
  successMessage = signal('');
  isConfirmed = signal(false);

  // Formulário
  confirmForm: FormGroup;

  // Galeria de fotos
  photos = [
    { src: 'images/1.jpg', alt: 'Alice com 1 aninho', label: '1 Aninho' },
    { src: 'images/2.jpg', alt: 'Alice com 2 aninhos', label: '2 Aninhos' },
    { src: 'images/3.jpg', alt: 'Alice com 3 aninhos', label: '3 Aninhos' },
    { src: 'images/4.jpg', alt: 'Alice com 4 anos', label: 'Quase 4 Anos!' }
  ];

  private countdownInterval: any;

  constructor(private fb: FormBuilder) {
    this.confirmForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      presenca: ['Sim', Validators.required],
      observacao: ['']
    });

    // Inicializar EmailJS
    this.initializeEmailJS();
  }

  ngOnInit(): void {
    // Iniciar contagem regressiva
    this.startCountdown();
    
    // Criar partículas
    this.createParticles();

    // Scroll suave no indicador
    this.setupScrollIndicator();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private initializeEmailJS(): void {
    if (typeof emailjs !== 'undefined') {
      emailjs.init(this.EMAILJS_CONFIG.publicKey);
      console.log('📧 EmailJS inicializado com sucesso!');
    }
  }

  private startCountdown(): void {
    // Data da festa: 04/12/2025 às 19:30
    const targetDate = new Date('2025-12-04T19:30:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        this.countdown.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdown.set({ days, hours, minutes, seconds });
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  private createParticles(): void {
    const container = document.getElementById('particles');
    if (!container) return;

    // Brilhos mágicos - 80 sparkles espalhados por toda a página
    for (let i = 0; i < 80; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      
      // Metade dos brilhos começa imediatamente (delay 0-3s)
      // A outra metade começa um pouco depois (delay 3-6s)
      const delay = i < 40 ? Math.random() * 3 : Math.random() * 3 + 3;
      
      sparkle.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: ${-Math.random() * 100 - 50}%;
        animation: sparklefall ${Math.random() * 8 + 6}s linear ${delay}s infinite;
        will-change: transform, opacity;
      `;
      container.appendChild(sparkle);
    }

    // Animação dos brilhos
    if (!document.getElementById('particle-animation')) {
      const style = document.createElement('style');
      style.id = 'particle-animation';
      style.textContent = `
        /* Brilhos mágicos */
        .sparkle {
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #fff, transparent);
          border-radius: 50%;
          box-shadow: 
            0 0 6px #fff,
            0 0 12px #fff,
            0 0 18px #ffd700,
            0 0 24px #ffd700;
          pointer-events: none;
          z-index: 1;
        }

        .sparkle::before,
        .sparkle::after {
          content: '';
          position: absolute;
          background: #fff;
        }

        .sparkle::before {
          width: 8px;
          height: 1px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #ffd700;
        }

        .sparkle::after {
          width: 1px;
          height: 8px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #ffd700;
        }

        @keyframes sparklefall {
          0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translateY(5vh) translateX(${Math.random() * 30 - 15}px) scale(1);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(150vh) translateX(${Math.random() * 60 - 30}px) scale(0.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private setupScrollIndicator(): void {
    setTimeout(() => {
      const indicator = document.querySelector('.scroll-indicator');
      indicator?.addEventListener('click', () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      });
    }, 100);
  }

  // Métodos de contadores
  incrementAdultos(): void {
    if (this.adultos() < 20) {
      this.adultos.update(v => v + 1);
    }
  }

  decrementAdultos(): void {
    if (this.adultos() > 1) {
      this.adultos.update(v => v - 1);
    }
  }

  incrementCriancas0a4(): void {
    if (this.criancas0a4() < 20) {
      this.criancas0a4.update(v => v + 1);
    }
  }

  decrementCriancas0a4(): void {
    if (this.criancas0a4() > 0) {
      this.criancas0a4.update(v => v - 1);
    }
  }

  incrementCriancas5plus(): void {
    if (this.criancas5plus() < 20) {
      this.criancas5plus.update(v => v + 1);
    }
  }

  decrementCriancas5plus(): void {
    if (this.criancas5plus() > 0) {
      this.criancas5plus.update(v => v - 1);
    }
  }

  // Submissão do formulário
  async onSubmit(): Promise<void> {
    if (this.confirmForm.invalid) {
      this.showMessage('Por favor, preencha seu nome completo!', 'error');
      return;
    }

    this.isSubmitting.set(true);

    const data: ConfirmationData = {
      nome: this.confirmForm.value.nome,
      presenca: this.confirmForm.value.presenca,
      adultos: this.adultos(),
      criancas0a4: this.criancas0a4(),
      criancas5plus: this.criancas5plus(),
      observacao: this.confirmForm.value.observacao
    };

    try {
      // Tentar enviar email
      await this.sendEmail(data);
      
      // Mostrar modal de sucesso
      this.isConfirmed.set(data.presenca === 'Sim');
      this.showSuccessModal.set(true);
      
      // Criar confetti
      this.createConfetti();
      
      // Resetar formulário
      this.confirmForm.reset({ presenca: 'Sim' });
      this.adultos.set(1);
      this.criancas0a4.set(0);
      this.criancas5plus.set(0);
      
    } catch (error) {
      console.error('❌ Erro ao enviar confirmação:', error);
      this.showMessage('Ops! Algo deu errado. Tente novamente!', 'error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private async sendEmail(data: ConfirmationData): Promise<void> {
    const totalPessoas = data.adultos + data.criancas0a4 + data.criancas5plus;

    const emailParams = {
      to_email: this.EMAILJS_CONFIG.emailDestino,
      from_name: 'Convite Alice 4 Anos - Jardim Encantado',
      nome_convidado: data.nome,
      presenca: data.presenca,
      num_adultos: data.adultos,
      num_criancas_0a4: data.criancas0a4,
      num_criancas_5plus: data.criancas5plus,
      total_pessoas: totalPessoas,
      observacao: data.observacao || 'Nenhuma observação',
      data_confirmacao: new Date().toLocaleString('pt-BR'),
      mensagem: `
NOVA CONFIRMAÇÃO RECEBIDA!

Nome: ${data.nome}
Presença: ${data.presenca}
Adultos: ${data.adultos}
Crianças (0-4 anos): ${data.criancas0a4}
Crianças (5+ anos): ${data.criancas5plus}
Total: ${totalPessoas} pessoa(s)
Observações: ${data.observacao || 'Nenhuma'}
Data: ${new Date().toLocaleString('pt-BR')}
      `
    };

    if (typeof emailjs !== 'undefined') {
      await emailjs.send(
        this.EMAILJS_CONFIG.serviceId,
        this.EMAILJS_CONFIG.templateId,
        emailParams
      );
      console.log('✅ Email enviado com sucesso!');
    }
  }

  closeModal(): void {
    this.showSuccessModal.set(false);
    
    // Scroll para mensagem final
    setTimeout(() => {
      const finalMessage = document.querySelector('.final-message');
      if (finalMessage) {
        finalMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = `toast-message toast-${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => messageDiv.remove(), 3000);
  }

  private createConfetti(): void {
    const colors = ['#FF99CC', '#FFB3D9', '#FFC0DD', '#FFD4E8', '#FF80BF', '#E066A3'];
    
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        opacity: 0.8;
        animation: confettiFall ${Math.random() * 3 + 2}s linear;
        z-index: 9999;
        border-radius: 50%;
      `;
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }

    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Método para formatação de números
  padNumber(num: number): string {
    return String(num).padStart(2, '0');
  }
}
