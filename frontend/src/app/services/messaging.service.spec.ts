import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { NEVER } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { MessagingService } from './messaging.service';

describe('MessagingService', () => {
  let service: MessagingService;
  let database: jasmine.SpyObj<AngularFireDatabase>;

  beforeEach(() => {
    database = jasmine.createSpyObj<AngularFireDatabase>('AngularFireDatabase', ['list']);
    database.list.and.returnValue({} as any);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MessagingService,
        { provide: AngularFireDatabase, useValue: database },
        { provide: AngularFireMessaging, useValue: { messages: NEVER, requestToken: NEVER } },
        { provide: AngularFireAuth, useValue: {} },
        { provide: AuthApiService, useValue: { user: NEVER } },
      ],
    });
    service = TestBed.inject(MessagingService);
  });

  it('constructs with Firebase dependencies and initializes its notification list', () => {
    expect(service).toBeTruthy();
    expect(database.list).toHaveBeenCalledOnceWith('/notification');
    expect(service.currentMessage.value).toBeNull();
  });
});
