import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  formsApi: any;
  sendForm: boolean = false;
  errorNotification: any;
  fileUrl: any;

  dataResults: any = JSON.parse(String(localStorage.getItem('speech'))) || [];

  constructor(private fb: FormBuilder, private hs: HomeService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log('MUCHAS GRACIAS POR PROBAR ESTA APLICACION 😀');

    this.formsApi = this.fb.group({
      url: ['', Validators.required]
    });
  }

  generateSpeech() {
    if (this.formsApi.value.url.length > 0) {
      this.sendForm = true;

      console.log('FormsAPI: ', this.formsApi.value);

      const url = this.formsApi.value.url;

      const videoId = url.split('v=')[1].split('&')[0];

      console.log('videoId: ', videoId);

      this.hs.postInfo({ url: videoId }).subscribe(
        (response: any) => {
          this.handleResult(response);
        }, (error: any) => {
          this.handleError(error);
        });

    } else {
      alert('Debes ingresar una URL de Youtube');
    }

  }

  handleResult(response: any): void {
    let respuesta = response;

    console.log('RESPONSE: ', respuesta);

    respuesta.url = `https://www.youtube.com/embed/${response.params}`;

    this.dataResults.push({ guion: respuesta.guion, respuesta: respuesta.respuesta, url: respuesta.url });
    localStorage.setItem('speech', JSON.stringify(this.dataResults));

    this.sendForm = false;
  }

  getVideo(url: string) {
    console.log(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  handleError(error: string): void {
    console.error(error)
    this.errorNotification = error;
    this.sendForm = false;
  }

  downloadFile(info: string) {
    const blob = new Blob([info], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    return this.fileUrl;
  }

}
