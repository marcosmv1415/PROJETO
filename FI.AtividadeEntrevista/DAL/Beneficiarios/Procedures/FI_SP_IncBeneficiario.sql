CREATE PROCEDURE FI_SP_IncBeneficiario
    @Cpf varchar(14),
    @Nome varchar(100),
    @IdCliente bigint
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @BeneficiarioId bigint;

    SELECT @BeneficiarioId = Id
    FROM Beneficiarios
    WHERE Cpf = @Cpf
      AND IdCliente = @IdCliente;

    IF @BeneficiarioId IS NULL
    BEGIN
        INSERT INTO Beneficiarios (Cpf, Nome, IdCliente)
        VALUES (@Cpf, @Nome, @IdCliente);

        SET @BeneficiarioId = SCOPE_IDENTITY();
    END

    SELECT @BeneficiarioId;
END