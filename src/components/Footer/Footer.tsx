'use client';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.logo}>
              <h3>ShopHub</h3>
              <p>최고의 제품을 합리적인 가격으로</p>
            </div>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className={styles.section}>
            <h4>쇼핑</h4>
            <ul className={styles.links}>
              <li><a href="/products">모든 제품</a></li>
              <li><a href="/sale">특가 상품</a></li>
              <li><a href="/new">신상품</a></li>
              <li><a href="/categories">카테고리</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>고객 지원</h4>
            <ul className={styles.links}>
              <li><a href="/contact">연락처</a></li>
              <li><a href="/shipping">배송 정보</a></li>
              <li><a href="/returns">반품/교환</a></li>
              <li><a href="/faq">자주 묻는 질문</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>회사 정보</h4>
            <ul className={styles.links}>
              <li><a href="/about">회사 소개</a></li>
              <li><a href="/careers">채용 정보</a></li>
              <li><a href="/privacy">개인정보처리방침</a></li>
              <li><a href="/terms">이용약관</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
          <div className={styles.payment}>
            <span>결제 수단:</span>
            <div className={styles.paymentIcons}>
              <svg width="32" height="20" viewBox="0 0 32 20" fill="currentColor">
                <path d="M0 4C0 1.79 1.79 0 4 0h24c2.21 0 4 1.79 4 4v12c0 2.21-1.79 4-4 4H4c-2.21 0-4-1.79-4-4V4zm2 0v12c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2z"/>
                <path d="M8 8h2v4H8zm4 0h2v4h-2zm4 0h2v4h-2zm4 0h2v4h-2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 